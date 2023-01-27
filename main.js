const canvas = document.getElementById("canvas");
const progressIndicator = document.getElementById("progress");
const ctx = canvas.getContext("2d");

const WIDTH = 512;
const HEIGHT = 288;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

worker.onmessage = function (e) {
  const { progress, pixels } = e.data;

  if (pixels) {
    ctx.putImageData(new ImageData(pixels, WIDTH, HEIGHT), 0, 0);
  } else {
    progressIndicator.innerText = `${progress}%`;
  }
};

worker.onerror = function (e) {
  console.log(e);
};

worker.postMessage({ image_width: WIDTH, image_height: HEIGHT, pixels }, [
  pixels.buffer,
]);
