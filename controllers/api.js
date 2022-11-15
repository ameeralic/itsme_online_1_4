const Resume = require("../models/Resumes");
const fs = require("fs");
const auth = require("../middleware/auth");
const express = require("express");

module.exports = class API {
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
    console.log(profileLink);
    try {
      const resume = await Resume.findOne({ profileLink: profileLink });
      if(resume){
        res.status(200).json({
          isAuth: false,
          isSuccess: true,
          data: resume,
          msg: "Profile Link valid, data successfully retrieved",
        });
        return
      }
      res.status(200).json({
        isAuth: false,
        isSuccess: false,
        data: resume,
        msg: "Profile Link invalid, No matching profile found",
      });

    } catch (err) {
      console.log(err.message);
      res
        .status(200)
        .json({
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
      res
        .status(200)
        .json({
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
    console.log(email);
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
    console.log(id);
    let new_image = "";
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (error) {
        console.log(error);
      }
    } else {
      new_image = req.body.old_image;
    }
    const newResume = req.body;
    newResume.image = new_image;
    try {
      await Resume.findByIdAndUpdate(id, newResume);
      res
        .status(200)
        .json({ isUpdated: true, msg: "Resume updated successfully" });
    } catch (error) {
      res
        .status(400)
        .json({
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
