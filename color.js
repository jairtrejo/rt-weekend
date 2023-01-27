export function writeColor(pixels, idx, pixel_color, samples_per_pixel) {
  let r = pixel_color.x;
  let g = pixel_color.y;
  let b = pixel_color.z;

  const scale = 1 / samples_per_pixel;
  r *= scale;
  g *= scale;
  b *= scale;

  pixels[idx] = Math.round(255 * r);
  pixels[idx + 1] = Math.round(255 * g);
  pixels[idx + 2] = Math.round(255 * b);
  pixels[idx + 3] = 255;

  return idx + 4;
}
