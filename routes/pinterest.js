const express = require('express');
const api = require('../api');
const requireToken = require('../lib/require-token');
const extractToken = require('../lib/extract-token');

const getBoardsRoute = async (req, res) => {
  const boards = await api(req.token).boards();
  res.json(boards);
};

const getPinsForBoardRoute = async (req, res) => {
  const {id} = req.params;
  const pins = await api(req.token).pins(id);
  res.json(pins);
};

const getPinInfoRoute = async (req, res) => {
  const {id} = req.params;
  const pin = await api(req.token).pin(id);
  res.json(pin);
};

let pinterestRouter = express.Router();
pinterestRouter.use(requireToken);
pinterestRouter.use(extractToken);

pinterestRouter.get('/boards', getBoardsRoute);
pinterestRouter.get('/boards/:id/pins', getPinsForBoardRoute);
pinterestRouter.get('/pins/:id', getPinInfoRoute);

module.exports = pinterestRouter;
