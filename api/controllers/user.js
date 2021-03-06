const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const uuidv1 = require('uuid/v1');

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user)
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email exists"
        });
      } 

      User.find({ username: req.body.username })
        .exec()
        .then(username => {
          if (username.length >= 1) {
            return res.status(409).json({
              message: "Username exists"
            });
          }

          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const newId = new mongoose.Types.ObjectId()
              const user = new User({
                _id: newId,
                email: req.body.email,
                username: req.body.username,
                vendor: req.body.vendor,
                name: req.body.name,
                password: hash,
                shop_id: req.body.shop_id
              });

              user
                .save()
                .then(result => {
                  res.status(201).json({
                    user: {
                      _id: result._id,
                      email: result.email,
                      username: result.username,
                      vendor: result.vendor,
                      name: result.name,
                      shop_id: result.shop_id
                    },
                    message: "User created"
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        });
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log('user', user)
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const userObj = {
            userId: user[0]._id
          };
          const token = jwt.sign(
            userObj,
            process.env.TOKEN_KEY,
            {
              expiresIn: "1h"
            }
          );
          const refreshToken = jwt.sign(
            {
              userId: user[0]._id
            }, 
            process.env.REFRESH_TOKEN_KEY, 
            {
              expiresIn: "1h"
            }
          );
          const response = {
            message: "Auth successful",
            token: token,
            refresh_token: refreshToken,
            email: user[0].email,
            username: user[0].username,
            vendor: user[0].vendor,
            name: user[0].name,
            _id: user[0]._id,
            shop_id: user[0].shop_id
          };
          return res.status(200).json(response);
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.all_users = (req, res, next) => {
  User.find()
    .select("-__v")
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.token = (req, res, next) => {
  const decoded = jwt.verify(req.body.refresh_token, process.env.REFRESH_TOKEN_KEY);
  const user = {
    userId: req.body.userId
  };

  if (decoded && (decoded.userId === user.userId)) {
    console.log('DECODED')
    const token = jwt.sign(
      user,
      process.env.TOKEN_KEY,
      {
        expiresIn: 60
      }
    );
    const refreshToken = jwt.sign(
      user, 
      process.env.REFRESH_TOKEN_KEY, 
      {
        expiresIn: "1h"
      }
    );
    const response = {
      token: token,
      refresh_token: refreshToken
    };
    res.status(200).json(response); 
  } else {
    res.status(404).send('Invalid request')
  }
};
