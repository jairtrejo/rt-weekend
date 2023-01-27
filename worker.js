import {
  add,
  mul,
  sub,
  Color,
  Point3,
  unit_vector,
  random_in_unit_sphere,
  //random_unit_vector,
  //random_in_hemisphere,
} from "./vec3.js";
import { writeColor } from "./color.js";
import { Sphere } from "./sphere.js";
import { HittableList } from "./hittable-list.js";
import { Camera } from "./camera.js";
import { Ray } from "./ray.js";

function ray_color(r, world, depth) {
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }

  let t;
  const hitRecord = world.hit(r, 0.001, Number.POSITIVE_INFINITY);

  if (hitRecord) {
    const target = add(hitRecord.p, hitRecord.normal, random_in_unit_sphere());
    //const target = add(hitRecord.p, hitRecord.normal, random_unit_vector());
    //const target = add(
    //hitRecord.p,
    //random_in_hemisphere(hitRecord.normal)
    //);
    return mul(
      0.5,
      ray_color(
        new Ray(hitRecord.p, sub(target, hitRecord.p)),
        world,
        depth - 1
      )
    );
  }

  const unit_direction = unit_vector(r.direction);
  t = 0.5 * (unit_direction.y + 1);
  return add(mul(1 - t, new Color(1, 1, 1)), mul(t, new Color(0.5, 0.7, 1)));
}

onmessage = function (e) {
  const { image_width, image_height, pixels, samples_per_pixel } = e.data;
  // Image
  const aspect_ratio = image_width / image_height;
  const max_depth = 50;

  // Camera
  const cam = new Camera(aspect_ratio);

  // World
  const world = new HittableList(
    new Sphere(new Point3(0, 0, -1), 0.5),
    new Sphere(new Point3(0, -100.5, -1), 100)
  );

  let idx = 0;
  for (let j = image_height - 1; j >= 0; --j) {
    if (j % Math.round(image_height / 10) === 0) {
      postMessage({
        progress: Math.round((100 * (image_height - j)) / image_height),
      });
    }
    for (let i = 0; i < image_width; ++i) {
      const color = new Color(0, 0, 0);
      for (let s = 0; s < samples_per_pixel; ++s) {
        const u = (i + Math.random()) / (image_width - 1);
        const v = (j + Math.random()) / (image_height - 1);

        const r = cam.get_ray(u, v);
        color.addInPlace(ray_color(r, world, max_depth));
      }

      idx = writeColor(pixels, idx, color, samples_per_pixel);
    }
  }

  postMessage({ progress: 100, pixels }, [pixels.buffer]);
};
