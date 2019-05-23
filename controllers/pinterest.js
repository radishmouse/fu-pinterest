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

const updatePinsForBoard = async (board_id, token) => {
  const pinsToReturn = [];
  const pins = await api(token).pins(board_id);
  const board = await Board.getByPinterestId(board_id);
  console.log('got pins');
  console.log(pins);
  if (pins) {
    console.log('here is a pin');
    console.log(pins[0]);
    for (let {
      url,
      image,
      original_link:link,
      note,
      // we don't care about the pinterest link
      id:pin_id,    
    } of pins) {
      // using the pinterest id, see if it's in the database.
      const p = Pin.from({
        board_id: board.id,
        pin_id,
        note,
        link,
        img: image.original.url
      });
      const existingPin = await Pin.getByPinterestId(pin_id);
      if (!existingPin) {
        await p.save();
      } else if (!areSame(existingPin, p)) {
        // assume that p is the most up to date
        p.id = existingPin.id;
        await p.save();
      }
      pinsToReturn.push(p);
      console.log('Saving pin with id', pin_id);
    }   
  }
  return pinsToReturn;
};

exports.getBoards = async (token) => {
  let boards = Board.getAll();
  if (boards.length === 0) {
    // boards = await updateBoards(token);
  } else {
    // turning off because I'm burning through my api calls
    // update them anyway, and ignore the return val
    setTimeout(updateBoards.bind(null, token), 0);
  }
  return boards;
};


exports.getPinsForBoard = async (id, token) => {
  const board = await Board.getById(id);
  let pins = await board.pins;
  if (pins.length === 0) {
    pins = await updatePinsForBoard(board.board_id, token);
  } else {
    // turning off because I'm burning through my api calls
    // update anyway
    // setTimeout(updatePinsForBoard.bind(null, board.board_id, token), 0);
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
