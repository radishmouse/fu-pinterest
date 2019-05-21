const express = require('express');
const requireToken = require('../lib/require-token');
const extractToken = require('../lib/extract-token');

const {
  getBoards,
  getPinsForBoard,
  getPinInfo
} = require('../controllers/pinterest');

const getBoardsRoute = async (req, res) => {
  const boards = await getBoards(req.token);
  res.json(boards);
};

const getPinsForBoardRoute = async (req, res) => {
  const {id} = req.params;
  const {board, pins} = await getPinsForBoard(id, req.token);
  res.json({board, pins});
};

const getPinInfoRoute = async (req, res) => {
  const {id} = req.params;
  const {pin} = await getPinInfo(id, req.token);
  res.json(pin);
};

let pinterestRouter = express.Router();
pinterestRouter.use(requireToken);
pinterestRouter.use(extractToken);

pinterestRouter.get('/boards', getBoardsRoute);
pinterestRouter.get('/boards/:id/pins', getPinsForBoardRoute);
pinterestRouter.get('/pins/:id', getPinInfoRoute);

module.exports = pinterestRouter;
