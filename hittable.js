import { mul, dot } from "./vec3";

export class Hittable {
  hit() {
    return null;
  }

  static to_face_normal(r, outward_normal) {
    const front_face = dot(r.direction, outward_normal) < 0;
    const normal = front_face ? outward_normal : mul(-1, outward_normal);
    return { front_face, normal };
  }
}
