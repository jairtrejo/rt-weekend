import { Hittable } from "./hittable.js";
import { sub, dot, mul } from "./vec3.js";

export class Sphere extends Hittable {
  constructor(center, radius, material) {
    super();
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(r, t_min, t_max) {
    const oc = sub(r.origin, this.center);
    const a = r.direction.length_squared();
    const half_b = dot(oc, r.direction);
    const c = oc.length_squared() - this.radius * this.radius;
    const discriminant = half_b * half_b - a * c;
    if (discriminant < 0) {
      return null;
    }

    const sqrtd = Math.sqrt(discriminant);

    let root = (-half_b - sqrtd) / a;
    if (root < t_min || t_max < root) {
      root = (-half_b + sqrtd) / a;
      if (root < t_min || t_max < root) {
        return null;
      }
    }

    const t = root;
    const p = r.at(root);
    const normal = mul(1 / this.radius, sub(p, this.center));

    return { t, p, material: this.material, ...Hittable.to_face_normal(r, normal) };
  }
}
