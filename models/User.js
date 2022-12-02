const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userInfo: {
    type: Object,
    default: {
        userFirstName: String,
        userLastName: String,
        userEmail: String,
        userPassword: String,
        userProfileLink: String,
        userDOB: String,
        userGender: String,
        userCity: String,
        userState: String,
        userCountry: String,
        userAgreeTAC: Boolean
    } 
  },
  resumeInfo: {
    resumeBasicInfo:{
      type: Object,
      default: {
      basicInfoFullName: '',
      basicInfoProfileImage: '',
      basicInfoBackgroundImage: '',
      basicInfoDesignation: '',
      basicInfoAbout: '',
      basicInfoWhatsApp: '',
      }
    },
    resumeContactInfo:{
      type:Object,
      default:{
        addressInfo:'',
        emailInfo:'',
        phoneNumber:'',
        whatsappNumber:'',
      }
    },
    resumePersonalInfo: {
      type: Array,
      default: [
        {
          personalInfoFieldName:"Email",
          personalInfoFieldValue: ""
        },
        {
          personalInfoFieldName: "Address",
          personalInfoFieldValue: ""
        },
        {
          personalInfoFieldName: "Phone Number",
          personalInfoFieldValue: ""
        },
        {
          personalInfoFieldName: "Gender",
          personalInfoFieldValue: ""
        }, 
        {
          personalInfoFieldName: "Marital Status",
          personalInfoFieldValue: ""
        },
        {
          personalInfoFieldName: "Nationality",
          personalInfoFieldValue:""
        },
        {
          personalInfoFieldName: "Languages",
          personalInfoFieldValue:""
        },
        {
          personalInfoFieldName: "Hobbies",
          personalInfoFieldValue:""
        }
      ]
    },
    resumeAddPersonalInfo: {
      type: Array
    },
    resumeSkillsInfo:{
      type: Array
    },
    resumeAcademicInfo:{
      type: Array
    },
    resumeWorkExperienceInfo:{
      type: Array
    },
    resumeReferenceInfo: {
      type: Array
    },
    resumeSocialLinksInfo:{
      type: Array
    }
  }

});

module.exports = mongoose.model("User", userSchema);