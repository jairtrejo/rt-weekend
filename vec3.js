export class Vec3 {
  constructor(e0, e1, e2) {
    this.e = [e0 || 0, e1 || 0, e2 || 0];
  }

  get x() {
    return this.e[0];
  }
  get y() {
    return this.e[1];
  }
  get z() {
    return this.e[2];
  }

  negated() {
    new Vec3(-this.e[0], -this.e[1], -this.e[2]);
  }

  addInPlace(v) {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
    return this;
  }

  scaleInPlace(t) {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
  }

  length() {
    return Math.sqrt(this.length_squared());
  }

  length_squared() {
    const e = this.e;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
  }
}

export const Color = Vec3;
export const Point3 = Vec3;

// Utility functions

export function add(...vs) {
  const result = new Vec3();
  for (const v of vs) {
    result.e[0] += v.x;
    result.e[1] += v.y;
    result.e[2] += v.z;
  }
  return result;
}

export function sub(...vs) {
  const result = new Vec3();
  result.e[0] = vs[0].x;
  result.e[1] = vs[0].y;
  result.e[2] = vs[0].z;

  for (const v of vs.slice(1)) {
    result.e[0] -= v.x;
    result.e[1] -= v.y;
    result.e[2] -= v.z;
  }
  return result;
}

export function mul(a, b) {
  let u, v, t;
  if (a instanceof Vec3) {
    [v, t] = [a, b];
  } else {
    [v, t] = [b, a];
  }

  if (t instanceof Vec3) {
    u = t;
    return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z);
  } else {
    return new Vec3(v.x * t, v.y * t, v.z * t);
  }
}

export function dot(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function cross(u, v) {
  return new Vec3(
    u.y * v.z - u.z * v.y,
    u.z * v.x - u.x * v.z,
    u.x * v.y - u.y * v.x
  );
}

export function unit_vector(v) {
  return mul(v, 1 / v.length());
}
