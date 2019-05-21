const Pin = require('../models/Pin');
const Board = require('../models/Board');

const api = require('../api');
const areSame = require('../lib/object-compare');

const updateBoards = async (token) => {
  let boardsFromApi = await api(token).boards();
  for (let {name, id:board_id} of boardsFromApi) {
    const b = Board.from({
      name,
      board_id
    });
    const existingBoard = await Board.getByPinterestId(board_id);
    if (!existingBoard) {      
      await b.save();
    } else if (existingBoard.name !== name) {
      existingBoard.name = name;
      existingBoard.save();
    }
    console.log('Saving board with id', board_id);
  }

  return boardsFromApi;  
};

const updatePin = async (id, token) => {
  // shouldn't be necessary...
};

const updatePinsForBoard = async (id, token) => {
  const pins = await api(token).pins(id);
  if (pins) {
    for (let {url, note, link, id:pin_id, img} of pins) {
      // using the pinterest id, see if it's in the database.
      const p = Pin.from({
        board_id: id,
        pin_id,
        note,
        link,
        img        
      });
      const existingPin = await Pin.getByPinterestId(pin_id);
      if (!existingPin) {
        await p.save();
      } else if (!areSame(existingPin, p)) {
        // assume that p is the most up to date
        p.id = existingPin.id;
        await p.save();
      }
      console.log('Saving pin with id', pin_id);
    }
    
    return pins;
  } else {
    return [];
  }
};

exports.getBoards = async (token) => {
  let boards = Board.getAll();
  if (boards.length === 0) {
    // boards = await updateBoards(token);
  } else {
    // update them anyway, and ignore the return val
    // setTimeout(updateBoards.bind(null, token), 0);
  }
  return boards;
};


exports.getPinsForBoard = async (id, token) => {
  const board = await Board.getById(id);
  let pins = await board.pins;
  if (pins.length === 0) {
    pins = await updatePinsForBoard(board.board.id, token);
  } else {
    // update anyway
    setTimeout(updatePinsForBoard.bind(null, board.board_id, token), 0);
  }
  return {
    board,
    pins
  };
};

exports.getPinInfo = async (id, token) => {
  const pin = await Pin.getById(id);
  return {
    pin
  };
};
