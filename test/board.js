const expect = require('chai').expect;
const Board = require('../models/Board');
const Pin = require('../models/Pin');

describe(`Model: Board`, () => {
  describe(`#constructor`, () => {
    it(`should accept a board_id, name`, () => {
      const board_id = String((new Date()).getTime());
      const name = 'yummy stuff';
      const b = new Board(board_id, name);

      expect(b.board_id).to.equal(board_id);
      expect(b.name).to.equal(name);
    });
  });
  describe(`.save`, () => {
    it(`should return the new id`, async () => {
      
      const board_id = String((new Date()).getTime());
      const name = 'yummy stuff';
      const b = new Board(board_id, name);

      const id = await b.save();
      expect(id).to.be.a('number');
    });
  });
  describe(`#from`, () => {
    it(`should create a new Board instance from an object`, () => {
      const result = {
        board_id: (new Date()).getTime(),
        name: 'other stuffs'
      };
      const b = Board.from(result);
      expect(b.board_id).to.equal(result.board_id);
      expect(b.name).to.equal(result.name);
    });
  });
  describe(`#getById`, () => {
    it(`should get one board`, async () => {
      
      const board_id = String((new Date()).getTime());
      const name = 'thingy stuffs';
      const b = new Board(board_id, name);

      const id = await b.save();
      const theBoard = await Board.getById(id);
      expect(theBoard.board_id).to.equal(board_id);
      expect(theBoard.name).to.equal(name);      
    });
  });
  describe(`#deleteById`, () => {
    it(`should not be in the database after deleting`, async () => {
      
      const board_id = String((new Date()).getTime());
      const name = 'thingy stuffs';
      const b = new Board(board_id, name);

      const id = await b.save();
      const result = Board.deleteById(id);
      expect(async () => {
        await Board.getById(id);
      }).to.Throw;
    });
  });
  describe(`#getByPinterestId`, () => {
    it(`should get one board`, async () => {
      
      const board_id = String((new Date()).getTime());
      const name = 'thingy stuffs';
      const b = new Board(board_id, name);

      const id = await b.save();
      const theBoard = await Board.getByPinterestId(board_id);
      expect(theBoard.board_id).to.equal(board_id);
      expect(theBoard.name).to.equal(name);      
    });
  });
  describe(`.pins`, () => {
    it(`should return the pins for this board`, async () => {
      const theBoard = await Board.getById(1);
      const thePins = await theBoard.pins;

      expect(thePins).to.be.an('array');
      expect(thePins).not.to.have.length(0);

      for (let pin of thePins) {
        expect(pin).to.be.an.instanceOf(Pin);
      }
      
    });
  });
});
