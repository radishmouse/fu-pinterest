const express = require('express');
const requireToken = require('../lib/require-token');
const extractToken = require('../lib/extract-token');

const {
  getBoards
} = require('../controllers/pinterest');

const getBoardsRoute = async (req, res) => {
  const boards = await getBoards(req.token);
  console.log(`Sending ${boards.length} boards as JSON`);
  res.json(boards);
};

const getPinsForBoardRoute = async (req, res) => {
  const {id} = req.params;
  const pins = await api(req.token).pins(id);
  res.json(pins);
};

const getPinInfoRoute = async (req, res) => {
  const {id} = req.params;
  const {data} = await api(req.token).pin(id);
  const pin = {
    ...data,
    img: await extractImage(data.url, '.GrowthUnauthPinImage img'),
    link: await resolveUrl(data.link)
  };
  res.json(pin);
};

let pinterestRouter = express.Router();
pinterestRouter.use(requireToken);
pinterestRouter.use(extractToken);

pinterestRouter.get('/boards', getBoardsRoute);
pinterestRouter.get('/boards/:id/pins', getPinsForBoardRoute);
pinterestRouter.get('/pins/:id', getPinInfoRoute);

module.exports = pinterestRouter;
