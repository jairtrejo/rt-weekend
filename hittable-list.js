import { Hittable } from "./hittable";

export class HittableList extends Hittable {
  constructor(...objects) {
    super();
    this.objects = objects ? Array.from(objects) : [];
  }

  hit(r, t_min, t_max) {
    let closest_so_far = t_max;
    let hit_record = null;

    for (const object of this.objects) {
      let a_hit = object.hit(r, t_min, closest_so_far);
      if (a_hit !== null) {
        hit_record = a_hit;
        closest_so_far = hit_record.t;
      }
    }

    return hit_record;
  }
}
