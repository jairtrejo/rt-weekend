import { Ray } from "./ray";
import { add, sub, mul, Vec3, Point3 } from "./vec3.js";

export class Camera {
  constructor(vfov, aspect_ratio) {
    const theta = (Math.PI * vfov) / 180;
    const h = Math.tan(theta / 2);
    const viewport_height = 2.0 * h;
    const viewport_width = aspect_ratio * viewport_height;

    const focal_length = 1;

    this.origin = new Point3(0, 0, 0);
    this.horizontal = new Vec3(viewport_width, 0, 0);
    this.vertical = new Vec3(0, viewport_height, 0);
    this.lower_left_corner = sub(
      this.origin,
      mul(0.5, this.horizontal),
      mul(0.5, this.vertical),
      new Vec3(0, 0, focal_length)
    );
  }

  get_ray(u, v) {
    return new Ray(
      this.origin,
      add(
        this.lower_left_corner,
        mul(u, this.horizontal),
        mul(v, this.vertical),
        mul(-1, this.origin)
      )
    );
  }
}
