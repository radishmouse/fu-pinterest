const Pin = require('../models/Pin');
const Board = require('../models/Board');

const api = require('../api');

const extractImage = require('../lib/extract-image');
const resolveUrl = require('../lib/resolve-url');


const updateBoards = async (token) => {
  console.log(`Fetching boards...`)
  let boardsFromApi = await api(token).boards();
  // and save them to the database
  
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

