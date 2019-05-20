const expect = require('chai').expect;
const Pin = require('../models/Pin');

describe(`Model: Pin`, () => {
  describe(`#constructor`, () => {
    it(`should accept a pin_id, note, link, img`, () => {
      const pin_id = 'abc123';
      const board_id = 1;
      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);

      expect(p.pin_id).to.equal(pin_id);
      expect(p.board_id).to.equal(board_id);
      expect(p.note).to.equal(note);
      expect(p.link).to.equal(link);
      expect(p.img).to.equal(img);
    });
  });
  describe(`.save`, () => {
    it(`should return the new id`, async () => {
      const pin_id = 'abc123';
      const board_id = 1;
      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);

      const id = await p.save();
      expect(id).to.be.a('number');
    });
  });
  describe(`#from`, () => {
    it(`should create a new Pin instance from an object`, () => {
      const result = {        
        pin_id:  'abc123',
        board_id: 1,
        
        note:    'it was a good pin',
        link:    'https://not-real.com',
        img:     'https://not-real.com/example.png',
      };
      const p = Pin.from(result);
      expect(p.pin_id).to.equal(result.pin_id);
      expect(p.board_id).to.equal(result.board_id);
      expect(p.note).to.equal(result.note);
      expect(p.link).to.equal(result.link);
      expect(p.img).to.equal(result.img);      
    });
  });
  describe(`#getById`, () => {
    it(`should get one pin`, async () => {
      const pin_id = 'abc123';
      const board_id = 1;

      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);

      const id = await p.save();
      const thePin = await Pin.getById(id);
      expect(thePin.pin_id).to.equal(pin_id);
      expect(thePin.board_id).to.equal(board_id);
      expect(thePin.note).to.equal(note);
      expect(thePin.link).to.equal(link);
      expect(thePin.img).to.equal(img);      
    });
  });
  describe(`#deleteById`, () => {
    it(`should not be in the database after deleting`, async () => {
      const pin_id = 'abc123';
      const board_id = 1;
      
      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);

      const id = await p.save();

      const result = await Pin.deleteById(id);
      expect(() => {
        Pin.getById(id);
      }).to.Throw;
    });
  });
  describe(`#getByPinterestId`, () => {
    it(`should get one pin`, async () => {
      const pin_id = String((new Date()).getTime());
      const board_id = 1;
      
      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);

      await p.save();
      const thePin = await Pin.getByPinterestId(pin_id);
      expect(thePin.pin_id).to.equal(pin_id);
      expect(thePin.note).to.equal(note);
      expect(thePin.link).to.equal(link);
      expect(thePin.img).to.equal(img);            
    });
  });
  describe(`#getByBoardId`, async () => {
    it(`should get all pins associated with a board`, async () => {
      const beforeAdd = await Pin.getByBoardId(2);
      expect(beforeAdd).to.be.an('array');
      expect(beforeAdd).to.have.length(0);
      
      const pin_id = String((new Date()).getTime());
      const board_id = 2;
      
      const note = 'it was a good pin';
      const link = 'https://not-real.com';
      const img = 'https://not-real.com/example.png';
      const p = new Pin(pin_id, board_id, note, link, img);
      await p.save();

      const afterAdd = await Pin.getByBoardId(2);
      expect(afterAdd).to.be.an('array');
      expect(afterAdd).to.have.length(1);
      for (let pin of afterAdd) {
        expect(pin).to.be.an.instanceOf(Pin);
      }

      const result = await Pin.deleteById(p.id);
    });
  });
});
