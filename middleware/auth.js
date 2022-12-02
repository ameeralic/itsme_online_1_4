const jwt = require("jsonwebtoken");

const createJWT = (loggedUserDetails) => {
  try {
    //Creating jwt token
    let token = jwt.sign(
      {
        idJWT: loggedUserDetails._id,
        emailJWT: loggedUserDetails.userInfo.userEmail,
        passwordJWT: loggedUserDetails.userInfo.userPassword
      },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
    return token;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const verifyJWT = function (req, res, next) {
  //Decoding the token

  //Authorization: 'Bearer TOKEN'
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null
  if (token) {
    try {
      const decodedToken = jwt.verify(token, "secretkeyappearshere");
      res.locals.authStatus = { isAuth: true, userID: decodedToken.idJWT };
      next();
      return;
    } catch (err) {
      //console.log(err);
      res.status(200).json({
        isAuth: false,
        data: null,
        msg: "Authentication failed, Token corrupted",
      });
    }
  }
  res.status(200).json({
    isAuth: false,
    data: null,
    msg: "Authentication failed, Empty token",
  });
};

module.exports = {
  createJWT,
  verifyJWT,
};
