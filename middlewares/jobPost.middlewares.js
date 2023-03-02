


function isJobPoster (req, res, next) {
    if(req.body.id === req.params.id) {
        next()
    }
    res.json({message: "not allowed to edit others Job Posts"})
}



module.exports = {
    isJobPoster,
  };
  