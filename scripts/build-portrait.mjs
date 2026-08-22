/**
 * 초상 사진 파생본 생성.
 *
 *   node scripts/build-portrait.mjs
 *
 * 원본  assets/유연상반신.png  (1326×1186, 흰 배경, 1.15MB · public 밖 = 배포 제외)
 * 산출
 *   public/portrait-{720,1080}.{webp,jpg}   4:5 세로 — 히어로·프로필용
 *   public/portrait-sq-{480,960}.{webp,jpg} 1:1     — 향후 OG·썸네일용
 *
 * 배경이 순백이라 editorial 표면색(--surface #fffdf8)에 얹으면 이음매가 보인다.
 * flatten 으로 배경을 표면색과 맞춰 종이 위에 인쇄된 것처럼 보이게 한다.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.resolve(__dirname, "../public");
/** 원본(마스터)은 배포물에 넣지 않으려고 public 밖에 둔다. */
const SRC = path.resolve(__dirname, "../assets/유연상반신.png");

/** editorial --surface. 흰 배경을 이 색으로 깔아 warm paper 와 이음매를 없앤다. */
const SURFACE = { r: 0xff, g: 0xfd, b: 0xf8 };

/**
 * 4:5 크롭 영역. 원본에서 인물은 x≈260~1130, 얼굴 중심 x≈636, 정수리 y≈80.
 * 세로는 원본 전체(1186)를 쓰고 가로만 인물 중심(695)에 맞춰 949px 잘라낸다.
 */
const CROP_45 = { left: 221, top: 0, width: 949, height: 1186 };

/** 1:1 — 얼굴이 위쪽 1/3에 오도록 */
const CROP_11 = { left: 221, top: 0, width: 1186, height: 1186 };

async function emit(crop, widths, prefix) {
  for (const w of widths) {
    const base = sharp(SRC)
      .extract(clamp(crop))
      .resize({ width: w, withoutEnlargement: true })
      .flatten({ background: SURFACE });

    await base.clone().webp({ quality: 86 }).toFile(path.join(PUB, `${prefix}-${w}.webp`));
    await base.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(PUB, `${prefix}-${w}.jpg`));
    console.log(`  ${prefix}-${w}.{webp,jpg}`);
  }
}

/** 원본 밖으로 나가지 않도록 보정 */
function clamp(c) {
  const { width: W, height: H } = meta;
  const left = Math.max(0, Math.min(c.left, W - 1));
  const top = Math.max(0, Math.min(c.top, H - 1));
  return {
    left,
    top,
    width: Math.min(c.width, W - left),
    height: Math.min(c.height, H - top),
  };
}

if (!fs.existsSync(SRC)) {
  console.error(`원본이 없습니다: ${SRC}`);
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
console.log(`원본 ${meta.width}×${meta.height}`);

console.log("4:5 (히어로 · 프로필)");
await emit(CROP_45, [720, 1080], "portrait");

console.log("1:1 (OG · 썸네일)");
await emit(CROP_11, [480, 960], "portrait-sq");

for (const f of fs.readdirSync(PUB).filter((f) => f.startsWith("portrait"))) {
  const kb = (fs.statSync(path.join(PUB, f)).size / 1024).toFixed(0);
  console.log(`  ${f.padEnd(24)} ${kb}KB`);
}
