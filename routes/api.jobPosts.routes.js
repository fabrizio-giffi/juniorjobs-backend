const router = require("express").Router();
const JobPost = require("../models/JobPost.model")
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { isJobPoster } = require("../middlewares/jobPost.middlewares")

router.get('/', async (req, res) => {
    try {
      const JobPostList = await JobPost.find();
      res.json(JobPostList);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: err.message });
    }
  });

router.get('/:id', isAuthenticated, async (req, res) =>{
    try{
        const currentJobPost = await JobPost.findById(req.params.id) 
        // console.log(currentJobPost)
        res.json(currentJobPost)
    } catch(err){
        console.log(err)
        res.status(404).json({message: err.message})
    }
})

router.put('/edit/:id', isAuthenticated, isJobPoster, async (req, res) =>{
    try{
        const changes = req.body
        delete changes.passwordHash
        const currentJobPost = await JobPost.findByIdAndUpdate(req.params.id, changes, {new:true}) 
        console.log(req.payload)
        res.json(currentJobPost)
    }catch(err){
        console.log(err)
        res.status(404).json({message: err.message})
    }
})


module.exports = router;
