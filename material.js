import { Ray } from "./ray";
import {
  add,
  dot,
  mul,
  random_in_unit_sphere,
  random_unit_vector,
  reflect,
  unit_vector,
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