const express = require("express");
const router = express.Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = config.get("jwtSecret");
const { check, validationResult } = require("express-validator");

//Bring in User Model
const User = require("../models/User");

//@route POST
//desc register user and give jwt
//method PUBLIC
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Valid Email address is required").isEmail(),
    check("phone", "Phone number must be greater than 8 numbers").isLength({
      min: 9
    }),
    check("password", "Password must be atleast 4 characters").isLength({
      min: 4
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      //Destructure data from the req body
      const { name, email, phone, password } = req.body;
      try {
        let user;
        //check to see if the user exists
        user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: "User already exists " });
        } else {
          //Create new user and insert to DB
          user = new User({
            name,
            email,
            phone,
            password
          });

          //Hash the password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);

          await user.save();

          //Send back a Json Web Token
          const payload = {
            user: {
              id: user.id
            }
          };

          jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            else {
              return res.send(token);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
