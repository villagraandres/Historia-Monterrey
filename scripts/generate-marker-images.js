const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const imagesRoot = path.join(projectRoot, 'assets', 'images');
const outputFile = path.join(projectRoot, 'src', 'constants', 'markerImages.js');

function isImageIndexFile(fileName) {
  return /^i\d+\.webp$/i.test(fileName);
}

function imageIndex(fileName) {
  const match = fileName.match(/^i(\d+)\.webp$/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function toRequirePath(folderName, fileName) {
  return `../../assets/images/${folderName}/${fileName}`;
}

const folders = fs
  .readdirSync(imagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const singleImageLines = [];
const carouselLines = [];

for (const folderName of folders) {
  const folderPath = path.join(imagesRoot, folderName);
  const files = fs
    .readdirSync(folderPath)
    .filter(isImageIndexFile)
    .sort((a, b) => imageIndex(a) - imageIndex(b));

  if (files.length === 0) {
    continue;
  }

  const key = JSON.stringify(folderName);
  singleImageLines.push(`  ${key}: require('${toRequirePath(folderName, files[0])}'),`);

  if (files.length > 1) {
    carouselLines.push(`  ${key}: [`);
    for (const fileName of files) {
      carouselLines.push(`    require('${toRequirePath(folderName, fileName)}'),`);
    }
    carouselLines.push('  ],');
  }
}

const output = `const markerImages = {\n${singleImageLines.join('\n')}\n  default: require('../../assets/images/icons/main.jpg'),\n};\n\nconst markerImageCarousels = {\n${carouselLines.join('\n')}\n};\n\nexport function getMarkerImageSource(markerId) {\n  return markerImages[markerId] ?? markerImages.default;\n}\n\nexport function getMarkerImages(markerId) {\n  return markerImageCarousels[markerId] ?? [getMarkerImageSource(markerId)];\n}\n`;

fs.writeFileSync(outputFile, output, 'utf8');
console.log(`Generated ${path.relative(projectRoot, outputFile)}`);