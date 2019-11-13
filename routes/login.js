const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//User model
const User = require("../models/User");

//@route POST
//@desc Handled login and send token to logged user
//@access PUBLIC
router.post(
  "/",
  [
    check("email", "Email address required").isEmail(),
    check("password", "Password required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      let user;
      const { email, password } = req.body;
      //Find user by searching with email
      user = await User.findOne({ email });
      if (!user) {
        return res.sendStatus(400).json("User Does not exist");
      } else {
        //Compare the two passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          else {
            if (isMatch) {
              //sign and send token
              const payload = {
                user: {
                  id: user.id
                }
              };
              jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 36000 },
                (err, token) => {
                  if (err) throw err;
                  else {
                    res.send(token);
                  }
                }
              );
            } else {
              return res.send("Password did not match");
            }
          }
        });
      }
    } else {
      return res.status(400).json("Login Failed");
    }
  }
);

module.exports = router;
