const canvas = document.getElementById("canvas");
const progressIndicator = document.getElementById("progress");
const ctx = canvas.getContext("2d");

const WIDTH = 256;
const HEIGHT = 256;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

const worker = new Worker("worker.js");

worker.onmessage = function (e) {
  const { progress, pixels } = e.data;

  if (pixels) {
    ctx.putImageData(new ImageData(pixels, WIDTH, HEIGHT), 0, 0);
  } else {
    progressIndicator.innerText = `${progress}%`;
  }
};

worker.postMessage({ WIDTH, HEIGHT, pixels }, [pixels.buffer]);
