import {
  add,
  mul,
  dot,
  Color,
  Point3,
  Vec3,
  sub,
  unit_vector,
} from "./vec3.js";
import { writeColor } from "./color.js";
import { Ray } from "./ray.js";

function hit_sphere(center, radius, r) {
  const oc = sub(r.origin, center);
  const a = r.direction.length_squared();
  const half_b = dot(oc, r.direction);
  const c = oc.length_squared() - radius * radius;
  const discriminant = half_b * half_b - a * c;
  if (discriminant < 0) {
    return -1.0;
  } else {
    return (-half_b - Math.sqrt(discriminant)) / a;
  }
}

function ray_color(r) {
  let t = hit_sphere(new Point3(0, 0, -1), 0.5, r);

  if (t > 0) {
    const N = unit_vector(sub(r.at(t), new Vec3(0, 0, -1)));
    return mul(0.5, new Color(N.x + 1, N.y + 1, N.z + 1));
  }

  const unit_direction = unit_vector(r.direction);
  t = 0.5 * (unit_direction.y + 1);
  return add(mul(1 - t, new Color(1, 1, 1)), mul(t, new Color(0.5, 0.7, 1)));
}

onmessage = function (e) {
  const { image_width, image_height, pixels } = e.data;
  // Image
  const aspect_ratio = image_width / image_height;

  // Camera
  const viewport_height = 2.0;
  const viewport_width = aspect_ratio * viewport_height;
  const focal_length = 1.0;

  const origin = new Point3(0, 0, 0);
  const horizontal = new Vec3(viewport_width, 0, 0);
  const vertical = new Vec3(0, viewport_height, 0);
  const lower_left_corner = sub(
    origin,
    mul(0.5, horizontal),
    mul(0.5, vertical),
    new Vec3(0, 0, focal_length)
  );

  let idx = 0;
  for (let j = image_height - 1; j >= 0; --j) {
    if (j % 15 === 0) {
      postMessage({
        progress: Math.round((100 * (image_height - j)) / image_height),
      });
    }
    for (let i = 0; i < image_width; ++i) {
      const u = i / (image_width - 1);
      const v = j / (image_height - 1);

      const r = new Ray(
        origin,
        add(
          lower_left_corner,
          mul(u, horizontal),
          mul(v, vertical),
          mul(-1, origin)
        )
      );

      idx = writeColor(pixels, idx, ray_color(r));
    }
  }

  postMessage({ progress: 100, pixels }, [pixels.buffer]);
};