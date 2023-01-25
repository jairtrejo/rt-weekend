const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 256;
const HEIGHT = 256;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const arrayBuffer = new ArrayBuffer(WIDTH * HEIGHT * 4);
const pixels = new Uint8ClampedArray(arrayBuffer);

for (let j = HEIGHT - 1; j >= 0; --j) {
  for (let i = 0; i < WIDTH; ++i) {
    let r = Math.floor(256 * i / (WIDTH - 1));
    let g = Math.floor(256 * (HEIGHT - j) / (HEIGHT - 1));
    let b = Math.floor(256 * 0.25);

    const idx  = (j * WIDTH + i) * 4;
    pixels[idx] = r;
    pixels[idx+1] = g;
    pixels[idx+2] = b;
    pixels[idx+3] = 255;
  }
}

ctx.putImageData(new ImageData(pixels, WIDTH, HEIGHT), 0, 0);
