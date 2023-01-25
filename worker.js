import { Color } from './vec3.js';
import { writeColor } from './color.js';

onmessage = function (e) {
  const { WIDTH, HEIGHT, pixels } = e.data;

  let idx = 0;
  for (let j = HEIGHT - 1; j >= 0; --j) {
    if (j % 15 === 0) {
      postMessage({ progress: Math.round((100 * (HEIGHT - j)) / HEIGHT) });
    }
    for (let i = 0; i < WIDTH; ++i) {
      let r = Math.floor((256 * i) / (WIDTH - 1));
      let g = Math.floor((256 * j) / (HEIGHT - 1));
      let b = Math.floor(256 * 0.25);

      idx = writeColor(pixels, idx, new Color(r, g, b));
    }
  }

  postMessage({ progress: 100, pixels }, [pixels.buffer]);
};
