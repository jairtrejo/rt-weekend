import { Ray } from "./ray";
import {
  add,
  dot,
  mul,
  random_in_unit_sphere,
  random_unit_vector,
  reflect,
  refract,
  unit_vector,
  Color,
} from "./vec3";

export class Lambertian {
  constructor(albedo) {
    this.albedo = albedo;
  }

  scatter(_, hit_record) {
    let scatter_direction = add(hit_record.normal, random_unit_vector());

    while (scatter_direction.near_zero()) {
      scatter_direction = add(hit_record.normal, random_unit_vector());
    }

    return {
      scattered: new Ray(hit_record.p, scatter_direction),
      attenuation: this.albedo,
    };
  }
}

export class Metal {
  constructor(a, f) {
    this.albedo = a;
    this.fuzz = f;
  }

  scatter(r_in, hit_record) {
    const reflected = reflect(unit_vector(r_in.direction), hit_record.normal);
    const scattered = new Ray(
      hit_record.p,
      add(reflected, mul(this.fuzz, random_in_unit_sphere()))
    );
    const attenuation = this.albedo;

    if (dot(scattered.direction, hit_record.normal) > 0) {
      return { scattered, attenuation };
    } else {
      return null;
    }
  }
}

export class Dielectric {
  constructor(index_of_refraction) {
    this.ir = index_of_refraction;
  }

  scatter(r_in, hit_record) {
    const refraction_ratio = hit_record.front_face ? 1 / this.ir : this.ir;

    const unit_direction = unit_vector(r_in.direction);
    const cos_theta = Math.min(
      dot(mul(-1, unit_direction), hit_record.normal),
      1
    );
    const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);

    const cannot_refract = refraction_ratio * sin_theta > 1;

    let direction;
    if (
      cannot_refract ||
      Dielectric._reflectance(cos_theta, refraction_ratio) > Math.random()
    ) {
      direction = reflect(unit_direction, hit_record.normal);
    } else {
      direction = refract(unit_direction, hit_record.normal, refraction_ratio);
    }

    return {
      attenuation: new Color(1, 1, 1),
      scattered: new Ray(hit_record.p, direction),
    };
  }

  static _reflectance(cosine, ref_idx) {
    // Use Schlick's approximation for reflectance.
    let r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
}
