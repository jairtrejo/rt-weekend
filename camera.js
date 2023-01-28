import { Ray } from "./ray";
import { add, sub, mul, unit_vector, cross } from "./vec3.js";

export class Camera {
  constructor(lookfrom, lookat, vup, vfov, aspect_ratio) {
    const theta = (Math.PI * vfov) / 180;
    const h = Math.tan(theta / 2);
    const viewport_height = 2.0 * h;
    const viewport_width = aspect_ratio * viewport_height;

    const w = unit_vector(sub(lookfrom, lookat));
    const u = unit_vector(cross(vup, w));
    const v = cross(w, u);

    this.origin = lookfrom;
    this.horizontal = mul(viewport_width, u);
    this.vertical = mul(viewport_height, v);
    this.lower_left_corner = sub(
      this.origin,
      mul(0.5, this.horizontal),
      mul(0.5, this.vertical),
      w
    );
  }

  get_ray(s, t) {
    return new Ray(
      this.origin,
      add(
        this.lower_left_corner,
        mul(s, this.horizontal),
        mul(t, this.vertical),
        mul(-1, this.origin)
      )
    );
  }
}
