const express = require("express");
const router = express.Router();
const API = require("../controllers/api2");
const multer = require("multer");
// import middlewares
const auth = require("../middleware/auth");
const util = require('util')

// multer middleware
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.body.userData);

    if(file.fieldname === 'profileImage'){
      cb(null, "./uploads/profile-image");
    } else {
      cb(null, "./uploads/background-image");
    }

  },
  filename: function (req, file, cb) {
    var profileLink = req.body.profileLink
    console.log(profileLink);
    cb(null, file.fieldname + "_" + profileLink + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]);

var reqFinder = (req,res)=>{
  console.log('req is ' + req.body.userData);
  res.send('ok')
}


//public routes
router.post('/create',API.createUser)
router.post('/login',API.getUserByLogin)
router.post("/checkuser", API.checkUser);
router.post("/checkurl", API.checkURL);
router.get("/profilelinlk/:profileLink", API.getUserByProfileLink);


router.get("/auth", auth.verifyJWT, API.authUser);
router.get('/id',auth.verifyJWT,API.getUserByID)
// router.patch('/id',reqFinder)
router.patch('/id',auth.verifyJWT,upload,API.updateUser)


//Needs authentication
// router.get("/", API.fetchAllResume);
// router.get("/profilelinlk/:profileLink", API.fetchResumeByProfileLink);
// router.get("/getuniversity", API.fetchUniversity);
// router.post("/searchcollege", API.fetchColleges);
// router.get("/auth", auth.verifyJWT, API.authUser);
// router.post("/checkuser", API.checkUser);
// router.post("/checkurl", API.checkURL);
// router.post("/login", API.fetchResumeByLogin);
// router.get("/id", auth.verifyJWT, API.fetchResumeByID);
// router.post("/", upload, API.createResume);
// router.patch('/id',auth.verifyJWT,upload,API.updateResume)
// router.delete('/:id',API.deleteResume)

module.exports = router;
