const express = require('express');
const router = express.Router();
const gamesRoutes = require('../controllers/gamesController');

router
  .route('/top-5-cheap')
  .get(gamesRoutes.aliasTopGames, gamesRoutes.getAllGames);

router.route('/games-stats').get(gamesRoutes.getGamesStats);

router
  .route('/')
  .get(gamesRoutes.getAllGames)
  .post(gamesRoutes.CreateGames);

router
  .route('/:id')
  .get(gamesRoutes.getGamesByType)
  .post(gamesRoutes.updateGames)
  .delete(gamesRoutes.deleteGames);

module.exports =  router;
