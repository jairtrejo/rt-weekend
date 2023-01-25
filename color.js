export function writeColor(pixels, idx, pixel_color) {
    pixels[idx] = pixel_color.x;
    pixels[idx + 1] = pixel_color.y;
    pixels[idx + 2] = pixel_color.z;
    pixels[idx + 3] = 255;

    return idx + 4;
}
