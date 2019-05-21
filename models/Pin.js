const db = require('../db');

module.exports = class Pin {
  constructor(pin_id, board_id, note, link, img) {
    this.pin_id = pin_id;
    this.board_id = board_id;
    
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
    try {      
      const results = db.any(`select * from pins`);
      return results.map(Pin.from);
    } catch(err) {
      return [];
    }
  }

  static async getAllAsObject() {
    try {      
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
    } catch(err) {
      return {};
    }
  }

  static async getById(id) {
    try {      
      const result = await db.one(`select * from pins where id=$1`, [id]);
      return Pin.from(result);
    } catch(err) {
      return null;
    }
  }

  static async getByBoardId(id) {
    try {      
      const results = await db.any(`select * from pins where board_id=$1`, [id]);
      return results.length > 0 ? results.map(Pin.from) : [];
    } catch(err) {
      return [];
    }
  }
  
  static async deleteById(id) {    
    const result = await db.result(`delete from pins where id=$1`, [id]);
    return result;
  }

  static async getByPinterestId(id) {
    try {      
      const result = await db.one(`select * from pins where pin_id=$1`, [id]);
      return Pin.from(result);
    } catch(err) {
      return null;
    }
  }

  static async getByPinterestBoardId(id) {
    try {      
      const results = await db.any(`
select * from pins where board_id = (select id from boards where board_id=$1)
`, [id]);
      return results.length > 0 ? results.map(Pin.from) : [];
    } catch(err) {
      return [];
    }
  }

  async save() {
    const {id} = await db.one(`
insert into pins
  (pin_id, board_id, note, link, img)
values
  ($1, $2, $3, $4, $5)
returning id
`, [this.pin_id, this.board_id, this.note, this.link, this.img]);
    this.id = id;
    return id;
  }
};
