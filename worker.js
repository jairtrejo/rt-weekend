onmessage = function (e) {
  const { WIDTH, HEIGHT, pixels } = e.data;

  for (let j = HEIGHT - 1; j >= 0; --j) {
    if (j % 15 === 0) {
      postMessage({ progress: Math.round(100 * (HEIGHT - j) / HEIGHT) });
    }
    for (let i = 0; i < WIDTH; ++i) {
      let r = Math.floor((256 * i) / (WIDTH - 1));
      let g = Math.floor((256 * (HEIGHT - j)) / (HEIGHT - 1));
      let b = Math.floor(256 * 0.25);

      const idx = (j * WIDTH + i) * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = 255;
    }
  }

  postMessage({ progress: 100, pixels }, [pixels.buffer]);
};
