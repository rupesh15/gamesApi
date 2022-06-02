const req = require('express/lib/request');
const Games = require('../model/gamesModel');
const APIFeatures = require('./../utils/apiFeatures');
const multer = require('multer');
const AppError = require('../utils/appError')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log('inside multer filter ', file.mimetype)
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload =  multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

console.log('value is ',upload.single('photo'))
exports.uploadUserPhoto = upload.single('photo');

exports.aliasTopGames = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-rating';
  req.query.fields = 'name,type,price,rating';
  next();
};


exports.getAllGames = async (req, res) => {
  try {
    //filtering
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach(el => delete queryObj[el]);

    // //advanced filtering\
    // const queryStr = JSON.stringify(queryObj);
    // queryStr.replace(/\b()\b/g);
    // //  BUILD QUERY
    // let query = Games.find(queryObj);
    // .where('rating')
    // .lte(5)
    // .where('price')
    // .equals(0);

    //Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createAt');
    // }

    //page and limit
    // if (req.query.page || req.query.limit) {
    //   const page = req.query.page * 1 || 1;
    //   const limit = req.query.limit * 1 || 1;
    //   const skip = (page - 1) * limit;

    //   if (req.query.page) {
    //     const numGames = await Games.countDocuments(); //count number of documents
    //     if (skip > numGames) throw new Error('this page does not exist');
    //   }

    //   query = query.skip(skip).limit(limit);
    // } else {
    //   console.error('Invalid process..');
    // }
    // query = query.skip(skip).limit(limit);

    //EXECUTE QUERY 
    const features = new APIFeatures(Games.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const games = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: games.length,
      data: {
        games
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'something went wrong',
      message: err
    });
  }
};

exports.CreateGames = async (req, res) => {
  try {
    const newGames = await Games.create(req.body);
    res.status(200).json({
      status: 'successfull',
      data: newGames
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.resizeUserPhoto = async (req, res, next) => {
  console.log('req body is', req.body)
  if (!req.file) return next();
  console.log('req value is', req)

  req.file.filename = `user-${Date.now()}.jpeg`;
  console.log('req.file.buffer',req.file.buffer)

  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// const filteredBody = filterObj(res.body,'name' )

exports.updateGames = async (req, res) => {
  console.log('req updated games is', req.file, 'req.body is', req.body);
  if (req.file) req.body.photo = req.file.filename
  
  try {
    const games = await Games.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    console.log('inside update games', req.body)
    res.status(200).json({
      status: 'successfull',
      data: games
    });
  } catch (err) {
    res.status(404).json({
      status: 'something went wrong',
      data: err
    });
  }
};

exports.deleteGames = async (req, res) => {
  try {
    await Games.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'successfull',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'Something went wrong',
      data: err
    });
  }
};

exports.getGamesByType = async (req, res) => {
  try {
    console.log('query value is ', req.query);
    const games = await Games.findById(req.params.id);
    res.status(200).json({
      status: 'successfull',
      data: games
    });
  } catch (err) {
    res.status(404).json({
      status: 'something went wrong',
      data: err
    });
  }
};

exports.getGamesStats = async (req, res) => {
  try{
    const stats = await Games.aggregate([
      {
        $match: {rating: {$eq: 4}},
        
      },{
        $group: {
          _id: '$price',
          numOfGames: {$sum: 1},
          sumRating: {$sum: '$rating'},
          avgRating: {$avg: '$rating'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min : '$price'},
          maxPrice: {$max : '$price' }
        }
      }
    ]);
    res.status(200).json({
      status: 'successfull',
      data: stats
    });

  }catch(err){
    res.status(404).json({
      status: 'something went wrong',
      data: err
    });
  }
}
