exports.getIds = (req,res,next) => {
  console.log(`req is ${req}`)
  next();
}

exports.getAllArticles = (req, res) => {
    console.log(`Inside get all articles`)
  res.status(200).json({
      status: "success",
      message: "response not created yet"
  });
}
exports.getArticleById = (req, res) => {
  console.log(`Inside post articles`)
  res.status(200).json({
    status: "success",
    message: "get article"
});
}