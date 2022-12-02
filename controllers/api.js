const Resume = require("../models/Resumes");
const fs = require("fs");
const auth = require("../middleware/auth");
var csv = require("csv-parse")
const { parse } = require("csv-parse")

var colleges;
const parser = parse({delimiter: ','}, function(err, data){
  colleges = data
});

fs.createReadStream(__dirname+'/database.csv').pipe(parser);

module.exports = class API {

  static async fetchUniversity(req,res){
    const universities = [...new Set(colleges.map(item => item[1]))]
    console.log(universities);
    res.status(200).json({
      isAuth: false,
      isSuccess: true,
      data: JSON.stringify(universities),
      msg: "Universities data retrieved",
    });
  }
  static async fetchColleges(req, res) {
    // console.log(req.body);
    // var { keyword } = req.body
    // if(keyword !==''){
    //   keyword = keyword.toLowerCase()
    // }
    // var result = [];
  
    // for(var i = 0 ; i < colleges.length ; i++){
  
    //   if(colleges[i][2].toLowerCase().indexOf(keyword)>=0){	
  
    //     colleges[i][2] = colleges[i][2].replace(/\:[^>]*\)/ig,"");
    //     colleges[i][2] = colleges[i][2].replace(/(\(Id)/ig,"");
  
    //     colleges[i][1] = colleges[i][1].replace(/\:[^>]*\)/ig,"");
    //     colleges[i][1] = colleges[i][1].replace(/(\(Id)/ig,"");
  
    //     result.push(colleges[i]);
    //   }
    // }
    res.status(200).json({
      isAuth: false,
      isSuccess: true,
      data: JSON.stringify(colleges),
      msg: "College data retrieved",
    });
  
  }
  //fetch all Resumes
  // static async fetchAllResume(req, res) {
  //   try {
  //     const resumes = await Resume.find();
  //     res.status(200).json(resumes);
  //   } catch (err) {
  //     res.status(404).json({ message: err.message });
  //   }
  // }

  //fetch Resume by profile link
  static async fetchResumeByProfileLink(req, res) {
    const { profileLink } = req.params;
    try {
      const resume = await Resume.findOne({ profileLink: profileLink });
      if (resume) {
        res.status(200).json({
          isAuth: false,
          isSuccess: true,
          data: resume,
          msg: "Profile Link valid, data successfully retrieved",
        });
        return;
      }
      res.status(200).json({
        isAuth: false,
        isSuccess: false,
        data: resume,
        msg: "Profile Link invalid, No matching profile found",
      });
    } catch (err) {
      console.log(err.message);
      res.status(200).json({
        isAuth: false,
        isSuccess: true,
        data: null,
        msg: "Some error!, data failed retrieved - " + err.message,
      });
    }
  }
  //fetch Resume by id
  static async fetchResumeByID(req, res) {
    const id = res.locals.authStatus.userID;
    // if (!res.locals.authStatus.isAuth) {
    //   console.log("3");
    //   res.status(200).json({ isAuth: false,data:null, msg: "Authentication failed" });
    //   return;
    // }
    try {
      const resume = await Resume.findById(id);
      res.status(200).json({
        isAuth: true,
        data: resume,
        msg: "Authentication Success, data success fully retrieved retrieved",
      });
    } catch (err) {
      console.log(err.message);
      res.status(200).json({
        isAuth: true,
        data: null,
        msg: "Authentication Success, data failed retrieved" + err.message,
      });
    }
  }

  // Authenticate User
  static async authUser(req, res) {
    if (!res.locals.authStatus.isAuth) {
      res.status(200).json({ isAuth: false, msg: "Authentication failed" });
      return;
    } else {
      res.status(200).json({ isAuth: true, msg: "Authentication Success" });
    }
  }

  //fetch Resume by Login (Email and Password)
  static async fetchResumeByLogin(req, res) {
    const login = req.body;
    try {
      const resume = await Resume.findOne({ email: login.email });
      if (!login.password) {
        res.status(200).json({
          isLogin: false,
          userExist: true,
          jwt: null,
          data: [],
          msg: "User exists, Null password, login failed",
        });
      }

      if (resume.password === login.password) {
        res.status(200).json({
          isLogin: true,
          userExist: true,
          jwt: auth.createJWT(resume),
          data: resume,
          msg: "login success",
        });
      } else {
        res.status(200).json({
          isLogin: false,
          userExist: true,
          jwt: null,
          msg: "Incorrect password, login failed",
        });
      }
    } catch (err) {
      res.status(200).json({
        isLogin: false,
        userExist: false,
        jwt: null,
        msg: "User does'nt exist",
      });
    }
  }

  // Check whether if email registered or not
  static async checkUser(req, res) {
    const { email } = req.body;
    try {
      const resume = await Resume.findOne({ email: email });
      if (!resume) {
        res.status(200).json({ userExist: false, msg: "URL is free" });
        return;
      }
      res.status(200).json({
        userExist: true,
        data: resume,
        msg: "User exists/taken",
      });
    } catch (err) {
      res.status(200).json({ userExist: false, msg: err.message });
    }
  }

  // Check whether the URL taken or not
  static async checkURL(req, res) {
    const { profileLink } = req.body;
    try {
      const resume = await Resume.findOne({ profileLink: profileLink });
      if (!resume) {
        res.status(200).json({ urlExist: false, msg: "URL is free" });
        return;
      }
      res.status(200).json({
        urlExist: true,
        data: resume,
        msg: "URL is taken",
      });
    } catch (err) {
      res.status(404).json({ urlExist: false, msg: err.message });
    }
  }

  //create Resume
  static async createResume(req, res) {
    const resume = req.body;
    //const imageName = req.file.filename
    //resume.image = imageName
    try {
      await Resume.create(resume);
      res
        .status(200)
        .json({ isCreated: true, msg: "Resume created successfully" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  //update Resume
  static async updateResume(req, res) {
    const id = res.locals.authStatus.userID;
    let new_profileImage = "";
    let new_backgroundImage = "";
    const newResume = req.body;
    if (req.files) {
      if (req.files.profileImage) {
        new_profileImage = req.files["profileImage"][0].filename;
        try {
          fs.unlinkSync("./uploads/profile-image/" + req.body.old_profileImage);
        } catch (error) {
          console.log(error);
        }
      } else {
        new_profileImage = req.body.old_profileImage;
      }

      if (req.files.backgroundImage) {
        new_backgroundImage = req.files["backgroundImage"][0].filename;
        try {
          fs.unlinkSync(
            "./uploads/background-image/" + req.body.old_backgroundImage
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        new_backgroundImage = req.body.old_backgroundImage;
      }
      newResume.profileImage = new_profileImage;
      newResume.backgroundImage = new_backgroundImage;
    }

    if (req.body.delete_profileImage) {
      try {
        fs.unlinkSync("./uploads/profile-image/" + req.body.old_profileImage);
      } catch (error) {
        console.log(error);
      }
      newResume.profileImage = "";
    }

    if (req.body.delete_backgroundImage) {
      try {
        fs.unlinkSync(
          "./uploads/background-image/" + req.body.old_backgroundImage
        );
      } catch (error) {
        console.log(error);
      }
      newResume.backgroundImage = "";
    }

    try {
      await Resume.findByIdAndUpdate(id, newResume);
      res
        .status(200)
        .json({ isUpdated: true, msg: "Resume updated successfully" });
    } catch (error) {
      res.status(400).json({
        isUpdated: false,
        msg: "Resume failed to Update" + error.message,
      });
    }
  }

  // //delete Resume
  // static async deleteResume(req,res) {
  //     const id = req.params.id
  //     try {
  //         const result = await Resume.findByIdAndDelete(id)
  //         if(result.image !== '') {
  //             try {
  //                 fs.unlinkSync('./uploads/' + result.image)
  //             } catch (error) {
  //                console.log(error);
  //             }
  //         }
  //         res.status(200).json({msg:"Resume deleted Successfully"})
  //     } catch (error) {
  //         res.status(404).json({msg: error.message})
  //     }
  // }
};
