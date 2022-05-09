const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    rating: {
      type: Number,
      default: '5'
    },
    type: String,
    price: {
      type: Number,
      required: [true, 'games must have price']
    },
    space: {
      type: Number,
      required: [true,'game must have space']
    },
    lastPlayed: {
      type: Number,
    },
    lastInstalled: {
      type: String
    },
    lastPlayed: {
      type: String
    },
    yearOfLaunch: {
      type: String
    },
    recommendedPlayed: {
      type: Number
    },
    gameTime: {
      type: Number
    },
    currenttime: {
      type: Date,
      default: Date.now()
    }
  });

  const Games = mongoose.model('Games', gamesSchema);

  module.exports = Games;