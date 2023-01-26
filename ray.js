import { mul, add } from "./vec3.js";

export class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t) {
    return add(this.origin, mul(t, this.direction));
  }
}
