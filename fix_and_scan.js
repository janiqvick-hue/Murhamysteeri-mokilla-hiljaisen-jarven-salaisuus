import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/images/locations/kitchen.png');

// Find IEND chunk
const iendPattern = Buffer.from([0x49, 0x45, 0x4E, 0x44]); // 'IEND'
const iendIndex = data.indexOf(iendPattern);

if (iendIndex !== -1) {
  console.log(`Found IEND at index ${iendIndex}, total length: ${data.length}`);
  const cleanData = data.subarray(0, iendIndex + 8); // 'IEND' is 4 bytes, plus 4 bytes CRC

  
  const png = new PNG();
  png.parse(cleanData, (error, img) => {
    if (error) {
      console.error('Error parsing cleaned PNG:', error);
      return;
    }
    console.log(`Clean PNG parsed successfully! Dimensions: ${img.width}x${img.height}`);
    
    // Let's analyze the picture to find where there is a circular clock!
    // Since we know the clock is a circular object on the wall (likely white, dark, or wooden),
    // let's print a downsampled ASCII visualization of the top half of the image!
    const cols = 80;
    const rows = 20; // Top half
    const cellW = img.width / cols;
    const cellH = (img.height / 2) / rows;

    let output = '';
    for (let r = 0; r < rows; r++) {
      let rowStr = '';
      for (let c = 0; c < cols; c++) {
        let sumL = 0;
        let count = 0;
        const startX = Math.floor(c * cellW);
        const endX = Math.floor((c + 1) * cellW);
        const startY = Math.floor(r * cellH);
        const endY = Math.floor((r + 1) * cellH);

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (img.width * y + x) << 2;
            const red = img.data[idx];
            const green = img.data[idx + 1];
            const blue = img.data[idx + 2];
            const l = 0.299 * red + 0.587 * green + 0.114 * blue;
            sumL += l;
            count++;
          }
        }
        const avgL = sumL / count;
        const chars = ' .:-=+*#%@';
        const charIdx = Math.min(chars.length - 1, Math.max(0, Math.floor((avgL / 255) * chars.length)));
        rowStr += chars[charIdx];
      }
      output += rowStr + '\n';
    }
    console.log(output);
  });
} else {
  console.log('IEND pattern not found!');
}
