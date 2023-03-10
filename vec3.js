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
    return new Vec3(-this.e[0], -this.e[1], -this.e[2]);
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

  near_zero() {
    const s = 1e-8;
    return (
      Math.abs(this.e[0] < s) &&
      Math.abs(this.e[1] < s) &&
      Math.abs(this.e[2] < s)
    );
  }

  static random() {
    return new Vec3(Math.random(), Math.random(), Math.random());
  }

  static random_in_range(min, max) {
    return new Vec3(
      min + Math.random() * (max - min),
      min + Math.random() * (max - min),
      min + Math.random() * (max - min)
    );
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

export function reflect(v, n) {
  return sub(v, mul(2 * dot(v, n), n));
}

export function refract(uv, n, etai_over_etat) {
  const cos_theta = Math.min(dot(mul(-1, uv), n), 1);
  const r_out_perp = mul(etai_over_etat, add(uv, mul(cos_theta, n)));
  const r_out_parallel = mul(
    -Math.sqrt(Math.abs(1 - r_out_perp.length_squared())),
    n
  );

  return add(r_out_perp, r_out_parallel);
}

// Random utilities

export function random_in_unit_sphere() {
  while (true) {
    const p = Vec3.random_in_range(-1, 1);
    if (p.length_squared() >= 1) continue;
    return p;
  }
}

export function random_unit_vector() {
  return unit_vector(random_in_unit_sphere());
}

export function random_in_hemisphere(normal) {
  const in_unit_sphere = random_in_unit_sphere();
  if (dot(in_unit_sphere, normal) > 0) {
    return in_unit_sphere;
  } else {
    return in_unit_sphere.negated();
  }
}

export function random_in_unit_disk() {
  while (true) {
    const p = new Vec3(-1 + 2 * Math.random(), -1 + 2 * Math.random(), 0);
    if (p.length_squared() >= 1) continue;
    return p;
  }
}
