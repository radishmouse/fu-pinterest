const db = require('../db');

module.exports = class Pin {
  constructor(pin_id, note, link, img) {
    this.pin_id = pin_id;
    this.note = note;
    this.link = link;
    this.img = img;
  }

  static from(obj) {
    const p = new Pin();
    Object.keys(obj).forEach(k => p[k] = obj[k]);
    return p;
  }

  static async getAll() {
    const results = db.any(`select * from pins`);
    return results.map(Pin.from);
  }

  static async getAllAsObject() {
    return await Pin.getAll().reduce((acc, p) => {
      const simpleP = {
        ...p
      };
      delete simpleP['pin_id'];
      return {
        ...acc,
        [p.pin_id]: simpleP
      };
    }, {});
  }

  static async getById(id) {
    const result = await db.one(`select * from pins where id=$1`, [id]);
    return Pin.from(result);
  }

  static async deleteById(id) {
    const result = await db.result(`delete from pins where id=$1`, [id]);
    return result;
  }

  static async getByPinterestId(id) {
    const result = await db.one(`select * from pins where pin_id=$1`, [id]);
    return Pin.from(result);
  }

  async save() {
    const {id} = await db.one(`
insert into pins
  (pin_id, note, link, img)
values
  ($1, $2, $3, $4)
returning id
`, [this.pin_id, this.note, this.link, this.img]);
    return id;
  }
};
