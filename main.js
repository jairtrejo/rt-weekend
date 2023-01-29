import { random_scene } from "./world";

const canvas = document.getElementById("canvas");
const progressIndicator = document.getElementById("progress");
const time = document.getElementById("time");
const ctx = canvas.getContext("2d");

const WIDTH = 1024;
const HEIGHT = 576;
//const WIDTH = 256;
//const HEIGHT = 144;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const finalPixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
const samplesPerPixel = 500;

function makeWorker(idx, progresses, images, onProgress) {
  const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = function (e) {
    const { progress, pixels } = e.data;

    if (pixels) {
      images[idx] = pixels;
    } else {
      progresses[idx] = progress;
    }

    onProgress();
  };

  worker.onerror = function (e) {
    console.log(e);
  };

  return worker;
}

async function render() {
  const numWorkers = Math.round(navigator.hardwareConcurrency / 2);
  const images = [];
  const progresses = [];
  for (let i = 0; i < numWorkers; ++i) {
    images.push(null);
    progresses.push(0);
  }

  const world = random_scene();

  const start = Date.now();
  let wakeLock = await navigator.wakeLock.request('screen');

  for (let i = 0; i < numWorkers; ++i) {
    const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
    const worker = makeWorker(i, progresses, images, () => {
      if (images.length == numWorkers && images.every((img) => img !== null)) {
        for (let i = 0; i < finalPixels.length; ++i) {
          finalPixels[i] =
            images.reduce((acc, current) => (acc += current[i]), 0) /
            numWorkers;
        }
        const end = Date.now();
        time.innerText = `${((end - start) / 1000).toFixed(2)}s`;
        ctx.putImageData(new ImageData(finalPixels, WIDTH, HEIGHT), 0, 0);
        wakeLock.release();
      } else {
        const progress =
          progresses.reduce((acc, current) => acc + current, 0) / numWorkers;
        progressIndicator.innerText = `${progress}%`;
      }
    });
    worker.postMessage(
      {
        image_width: WIDTH,
        image_height: HEIGHT,
        pixels,
        samples_per_pixel: samplesPerPixel / numWorkers,
        world,
      },
      [pixels.buffer]
    );
  }
}

render();

progressIndicator.innerText = "0%";
