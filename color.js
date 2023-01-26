export function writeColor(pixels, idx, pixel_color) {
    pixels[idx] = Math.round(255 * pixel_color.x);
    pixels[idx + 1] = Math.round(255 * pixel_color.y);
    pixels[idx + 2] = Math.round(255 * pixel_color.z);
    pixels[idx + 3] = 255;

    return idx + 4;
}
