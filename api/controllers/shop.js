const mongoose = require("mongoose");
const Shop = require("../models/shop");

exports.shop_get_all = (req, res, next) => {
  Shop.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        shop: docs.map(doc => {
          return {
            _id: doc._id,
            language: doc.language,
            name: doc.name,
            country: doc.country,
            currency: doc.currency,
            user_id: doc.user_id,
            request: {
              type: "GET",
              url: "http://localhost:3000/shop/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.shop_create_shop = (req, res, next) => {
  const username = req.params.username;

  Shop.find({ name: username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Shop already exists"
        });
      } 

      const shop = new Shop({
        _id: new mongoose.Types.ObjectId(),
        language: req.body.language,
        name: username,
        country: req.body.country,
        currency: req.body.currency,
        user_id: req.body.user_id
      });

      shop
        .save()
        .then(result => {
          res.status(201).json({
            message: "Shop created"
          });
        })
        .catch(err => {
          res.status(500).json({
              error: err
          });
        });
    });
};

exports.shop_get_shop = (req, res, next) => {
  const shopId = req.params.shopId;

  Shop.findById(shopId)
    .select("-__v")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          shop: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/shop/" + doc.username
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.shop_delete_shop = (req, res, next) => {
  const id = req.params.shopId;

  Shop.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Shop deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/shop",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
