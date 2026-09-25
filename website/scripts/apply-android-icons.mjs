import { copyFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const iconSource = join(root, "resources", "android-icons", "with-bg");
const resRoot = join(root, "android", "app", "src", "main", "res");

const densities = [
  ["mipmap-mdpi", "mipmap-mdpi.png"],
  ["mipmap-hdpi", "mipmap-hdpi.png"],
  ["mipmap-xhdpi", "mipmap-xhdpi.png"],
  ["mipmap-xxhdpi", "mipmap-xxhdpi.png"],
  ["mipmap-xxxhdpi", "mipmap-xxxhdpi.png"],
];

for (const [density, sourceFile] of densities) {
  const source = join(iconSource, sourceFile);
  const targetDir = join(resRoot, density);

  for (const targetFile of ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"]) {
    copyFileSync(source, join(targetDir, targetFile));
  }
}

const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;

writeFileSync(join(resRoot, "mipmap-anydpi-v26", "ic_launcher.xml"), adaptiveIconXml);
writeFileSync(join(resRoot, "mipmap-anydpi-v26", "ic_launcher_round.xml"), adaptiveIconXml);

console.log("Applied Briksy Android launcher icons.");