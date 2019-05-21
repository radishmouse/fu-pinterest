const db = require('../db');
const Pin = require('./Pin');

module.exports = class Board {
  constructor(board_id, name) {
    this.name = name;
    this.board_id = board_id;
  }

  static from(obj) {
    const p = new Board();
    Object.keys(obj).forEach(k => p[k] = obj[k]);
    return p;
  }

  static async getAll() {
    try {      
      const results = await db.any(`select * from boards`);
      return results.map(Board.from);
    } catch(err) {
      return [];
    }
  }

  static async getAllAsObject() {
    try {      
      return await Board.getAll().reduce((acc, p) => {
        const simpleP = {
          ...p
        };
        delete simpleP['board_id'];
        return {
          ...acc,
          [p.board_id]: simpleP
        };
      }, {});
    } catch(err) {
      return {};
    }
  }

  static async getById(id) {
    try {      
      const result = await db.one(`select * from boards where id=$1`, [id]);
      return Board.from(result);
    } catch(err) {
      return null;
    }
  }

  static async deleteById(id) {
    const result = await db.result(`delete from boards where id=$1`, [id]);
    return result;
  }

  static async getByPinterestId(id) {
    try {      
      const result = await db.one(`select * from boards where board_id=$1`, [id]);
      return Board.from(result);
    } catch(err) {
      console.log(err);
      return null;
    }
  }

  get pins() {
    try {
      return Pin.getByBoardId(this.id);      
    } catch(err) {
      return [];
    }

  }

  async save() {
    const {id} = await db.one(`
insert into boards
  (name, board_id)
values
  ($1, $2)
returning id
`, [this.name, this.board_id]);
    return id;
  }
};
