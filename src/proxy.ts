import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { buildView, sendView } from "@/lib/track";

/**
 * Next 16 proxy (구 middleware).
 *   1) 매 요청마다 Supabase 세션 쿠키를 갱신한다.
 *   2) /admin(로그인 페이지 제외)은 미로그인 시 /admin/login 으로 보낸다.
 *
 * 환경변수가 없으면(로컬 골격 확인) 아무 것도 하지 않고 통과시킨다.
 */
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  // 방문 기록(15일 유입 분석 보고서용). 응답을 기다리게 하지 않는다.
  event.waitUntil(
    buildView(request)
      .then((row) => (row ? sendView(row) : undefined))
      .catch(() => undefined)
  );

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");

  if (isAdmin && !isLoginPage && !user) {
    const next = request.nextUrl.clone();
    next.pathname = "/admin/login";
    return NextResponse.redirect(next);
  }
  if (isLoginPage && user) {
    const next = request.nextUrl.clone();
    next.pathname = "/admin";
    return NextResponse.redirect(next);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:jpg|jpeg|png|webp|svg|gif|ico)$).*)",
  ],
};
