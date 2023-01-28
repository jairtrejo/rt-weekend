import { Ray } from "./ray";
import {
  add,
  sub,
  mul,
  unit_vector,
  cross,
  random_in_unit_disk,
} from "./vec3.js";

export class Camera {
  constructor(lookfrom, lookat, vup, vfov, aspect_ratio, aperture, focus_dist) {
    const theta = (Math.PI * vfov) / 180;
    const h = Math.tan(theta / 2);
    const viewport_height = 2.0 * h;
    const viewport_width = aspect_ratio * viewport_height;

    const w = unit_vector(sub(lookfrom, lookat));
    const u = unit_vector(cross(vup, w));
    const v = cross(w, u);

    this.origin = lookfrom;
    this.horizontal = mul(focus_dist * viewport_width, u);
    this.vertical = mul(focus_dist * viewport_height, v);
    this.lower_left_corner = sub(
      this.origin,
      mul(0.5, this.horizontal),
      mul(0.5, this.vertical),
      mul(focus_dist, w)
    );
    this.lens_radius = aperture / 2;
    this.u = u;
    this.v = v;
  }

  get_ray(s, t) {
    const rd = mul(this.lens_radius, random_in_unit_disk());
    const offset = add(mul(rd.x, this.u), mul(rd.y, this.v));
    return new Ray(
      add(this.origin, offset),
      add(
        this.lower_left_corner,
        mul(s, this.horizontal),
        mul(t, this.vertical),
        mul(-1, this.origin),
        mul(-1, offset)
      )
    );
  }
}
