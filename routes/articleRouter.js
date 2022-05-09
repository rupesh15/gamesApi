const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();

router
.route('/')
.get(articleController.getAllArticles);

router
  .route('/:id')
  .get(articleController.getIds ,articleController.getArticleById)

module.exports = router;
