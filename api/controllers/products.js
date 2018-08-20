const mongoose = require("mongoose");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            product_image: doc.product_image,
            category: doc.category,
            username: doc.username,
            vendor_id: doc.vendor_id,
            description: doc.description,
            is_sale: doc.is_sale,
            sale_price: doc.sale_price,
            stock: doc.stock,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]
  const decodedToken = jwt.decode(token);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    username: req.body.username,
    vendor_id: decodedToken.userId,
    username: decodedToken.username,
    store_front: req.body.store_front,
    description: req.body.description,
    is_sale: req.body.is_sale,
    sale_price: req.body.sale_price,
    stock: req.body.stock
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          category: result.category,
          username: result.username,
          vendor_id: result.vendor_id,
          store_front: result.store_front,
          description: result.description,
          is_sale: result.is_sale,
          sale_price: result.sale_price,
          stock: result.stock,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
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

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("__v")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc && doc.store_front) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
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

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;

  Product.update({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
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

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
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

exports.vendor_products_get_all = (req, res, next) => {  
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
  
    Product.find({ vendor_id: decodedToken.userId })
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              product_image: doc.product_image,
              category: doc.category,
              username: doc.username,
              vendor_id: doc.vendor_id,
              description: doc.description,
              is_sale: doc.is_sale,
              sale_price: doc.sale_price,
              _id: doc._id,
              stock: doc.stock,
              request: {
                type: "GET",
                url: "http://localhost:3000/vendor-products/"
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

exports.vendor_products_get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("__v")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
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
