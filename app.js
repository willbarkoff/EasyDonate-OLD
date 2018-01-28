const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const express = require("express");
const app = express();
const stripe = require("stripe")(keySecret);

app.set("view engine", "pug");
app.use(express.static('public'));
app.use(require("body-parser").urlencoded({extended: false}));

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.post("/charge", (req, res) => {
  var amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Donation",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug"));
});

app.listen(4567);