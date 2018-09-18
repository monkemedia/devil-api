const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.create_account = (req, res, next) => {
  stripe.accounts.create({
    country: req.body.country,
    type: "custom",
    email: req.body.email
  })
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
};
