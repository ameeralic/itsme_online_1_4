const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  fullName:String,
  about: String,
  email: String,
  university: String,
  profileLink: String,
  password: String,
  profileImage: String,
  backgroundImage: String,
  agreeTAC: Boolean,
  basicInfo: {
    type: Array,
    default: [
      {
        label: "Designation",
        value: ""
      },
      {
        label:"Email",
        value: ""
      },
      {
        label: "Address",
        value: ""
      },
      {
        label: "Phone Number",
        value: ""
      },
      {
        label: "Gender",
        value: ""
      }, 
      {
        label: "Marital Status",
        value: ""
      },
      {
        label: "Nationality",
        value:""
      },
      {
        label: "Languages",
        value:""
      },
      
    ],
    // age: Number,
    // gender: String,
    // Nationality: String,
    // email: String,
    // phone: Number,
    // lang: String
  },
  additionalBasicInfo:[],
  skills: {
    type: Array,
    default: [
      {
        skillName:'',
        skillValue:0
      }
    ]
  },
  education: {
    type: Array
  },
  workExperience: {
    type: Array
  },
  socialLinks: {
    type: Array
  },
  reference: {
    type: Array
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
