const router = require("express").Router();
const Company = require("../models/Company.model")
const { isAuthenticated } = require("../middlewares/auth.middlewares");



router.get('/', async (req, res) => {
    try {
      const companyList = await Company.find();
      res.json(companyList);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: err.message });
    }
  });

router.get('/:id',async (req, res) =>{
    try{
        const currentCompany = await Company.findById(req.params.id) 
        // console.log(currentCompany)
        res.json(currentCompany)
    } catch(err){
        console.log(err)
        res.status(404).json({message: err.message})
    }
})

router.put('/edit/:id', async (req, res) =>{
    try{
        const changes = req.body
        console.log(req.body)
        delete changes.passwordHash
        const currentCompany = await Company.findByIdAndUpdate(req.params.id, changes, {new:true}) 
        console.log(req.payload)
        res.json(currentCompany)
    }catch(err){
        console.log(err)
        res.status(404).json({message: err.message})
    }
})



module.exports = router;