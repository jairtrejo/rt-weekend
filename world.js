import { Dielectric, Lambertian, Metal } from "./material.js";
import { Color, Point3, sub, mul } from "./vec3.js";
import { Sphere } from "./sphere.js";
import { HittableList } from "./hittable-list.js";

export function random_scene() {
  const world = [];

  const ground = new Lambertian(new Color(0.5, 0.5, 0.5));
  world.push(new Sphere(new Point3(0, -1000, 0), 1000, ground));

  for (let a = -11; a < 11; ++a) {
    for (let b = -11; b < 11; ++b) {
      const chooseMat = Math.random();
      const center = new Point3(
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random()
      );

      if (sub(center, new Point3(4, 0.2, 0)).length() > 0.9) {
        if (chooseMat < 0.8) {
          // Diffuse
          const albedo = mul(Color.random(), Color.random());
          world.push(new Sphere(center, 0.2, new Lambertian(albedo)));
        } else if (chooseMat < 0.95) {
          // Metal
          const albedo = Color.random_in_range(0.5, 1);
          const fuzz = Math.random() * 0.5;
          world.push(new Sphere(center, 0.2, new Metal(albedo, fuzz)));
        } else {
          // Glass
          world.push(new Sphere(center, 0.2, new Dielectric(1.5)));
        }
      }
    }
  }

  world.push(new Sphere(new Point3(0, 1, 0), 1, new Dielectric(1.5)));
  world.push(
    new Sphere(
      new Point3(-4, 1, 0),
      1,
      new Lambertian(new Color(0.4, 0.2, 0.1))
    )
  );
  world.push(
    new Sphere(new Point3(4, 1, 0), 1, new Metal(new Color(0.7, 0.6, 0.5), 0))
  );

  return new HittableList(...world);
}
