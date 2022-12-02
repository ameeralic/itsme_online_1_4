const UserModel = require("../models/User");
const fs = require("fs");
const auth = require("../middleware/auth");
const { userInfo } = require("os");

module.exports = class API {
  // create new user
  static async createUser(req, res) {
    console.log('ok');
    var User = {};
    User["userInfo"] = req.body;
    try {
      await UserModel.create(User);
      res
        .status(200)
        .json({ isCreated: true, msg: "Resume created successfully" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // get user by login
  static async getUserByLogin(req, res) {
    const login = req.body;
    try {
      const user = await UserModel.findOne({
        "userInfo.userEmail": login.email,
      });
      console.log(user.userInfo.userPassword);
      if (!login.password) {
        res.status(200).json({
          isLogin: false,
          userExist: true,
          jwt: null,
          data: [],
          msg: "User exists, Null password, login failed",
        });
      }

      if (user.userInfo.userPassword === login.password) {
        res.status(200).json({
          isLogin: true,
          userExist: true,
          jwt: auth.createJWT(user),
          data: user,
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

  // get user by id
  static async getUserByID(req, res) {
    const id = res.locals.authStatus.userID;
    try {
      const user = await UserModel.findById(id);
      res.status(200).json({
        isAuth: true,
        data: user,
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

  // check user
  static async checkUser(req, res) {
    console.log(req.body.userEmail);
    const userEmail = req.body.userEmail;
    try {
      const user = await UserModel.findOne({ "userInfo.userEmail": userEmail });
      if (!user) {
        res
          .status(200)
          .json({ userExist: false, msg: "No user exist in the email" });
        return;
      }
      res.status(200).json({
        userExist: true,
        data: user,
        msg: "User exists/taken",
      });
    } catch (err) {
      res.status(200).json({ userExist: false, msg: err.message });
    }
  }

  // check Url
  static async checkURL(req, res) {
    console.log(req.body.userProfileLink);
    const userProfileLink  = req.body.userProfileLink;
    try {
      const user = await UserModel.findOne({
        "userInfo.userProfileLink": userProfileLink,
      });
      if (!user) {
        res.status(200).json({ urlExist: false, msg: "URL is free" });
        return;
      }
      res.status(200).json({
        urlExist: true,
        data: user,
        msg: "URL is taken",
      });
    } catch (err) {
      res.status(404).json({ urlExist: false, msg: err.message });
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

    // get user by profile link
    static async getUserByProfileLink(req, res) {
        const { profileLink } = req.params;
        try {
          const user = await UserModel.findOne({ 'userInfo.userProfileLink': profileLink });
          if (user) {
            res.status(200).json({
              isAuth: false,
              isSuccess: true,
              data: user,
              msg: "Profile Link valid, data successfully retrieved",
            });
            return;
          }
          res.status(200).json({
            isAuth: false,
            isSuccess: false,
            data: null,
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

      // update user
  static async updateUser(req, res) {
    const id = res.locals.authStatus.userID;
    console.log(id);
    const newUser = JSON.parse(req.body.userData)
    if (req.files) {
      if (req.files.profileImage) {
        newUser.resumeInfo.resumeBasicInfo.basicInfoProfileImage = req.files["profileImage"][0].filename;
        if(req.body.old_profileImage){
          try {
            fs.unlinkSync("./uploads/profile-image/" + req.body.old_profileImage);
          } catch (error) {
            console.log(error);
          }
        }
      } 

      if (req.files.backgroundImage) {
        newUser.resumeInfo.resumeBasicInfo.basicInfoBackgroundImage = req.files["backgroundImage"][0].filename;
        if(req.body.old_backgroundImage){
          try {
            fs.unlinkSync(
              "./uploads/background-image/" + req.body.old_backgroundImage
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    if (req.body.delete_profileImage) {
      try {
        fs.unlinkSync("./uploads/profile-image/" + req.body.old_profileImage);
      } catch (error) {
        console.log(error);
      }
      newUser.resumeInfo.resumeBasicInfo.basicInfoProfileImage = "";
    }

    if (req.body.delete_backgroundImage) {
      try {
        fs.unlinkSync(
          "./uploads/background-image/" + req.body.old_backgroundImage
        );
      } catch (error) {
        console.log(error);
      }
      newUser.resumeInfo.resumeBasicInfo.basicInfoBackgroundImage = "";
    }

    try {
      await UserModel.findByIdAndUpdate(id, newUser);
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








  static async fetchUniversity(req, res) {
    const universities = [...new Set(colleges.map((item) => item[1]))];
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
