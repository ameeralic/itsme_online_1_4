const express = require("express");
const router = express.Router();
const API = require("../controllers/api");
const multer = require("multer");
// import middlewares
const auth = require("../middleware/auth");

// multer middleware
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body);
    if(file.fieldname === 'profileImage'){
      cb(null, "./uploads/profile-image");
    } else {
      cb(null, "./uploads/background-image");
    }

  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + req.body.profileLink + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]);

//public routes

//Needs authentication
// router.get("/", API.fetchAllResume);
router.get("/profilelinlk/:profileLink", API.fetchResumeByProfileLink);
router.get("/auth", auth.verifyJWT, API.authUser);
router.post("/checkuser", API.checkUser);
router.post("/checkurl", API.checkURL);
router.post("/login", API.fetchResumeByLogin);
router.get("/id", auth.verifyJWT, API.fetchResumeByID);
router.post("/", upload, API.createResume);
router.patch('/id',auth.verifyJWT,upload,API.updateResume)
// router.delete('/:id',API.deleteResume)

module.exports = router;
