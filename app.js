const config = require("./config.js")

const port = config.port;

const keyPublishable = config.keyPublishable;
const keySecret = config.keySecret;

const website = config.website;
const footerText = config.footerText;
const name = config.name;
const logo = config.logo;

const express = require("express");
const app = express();
const stripe = require("stripe")(keySecret);

app.set("view engine", "pug");
app.use(express.static('public'));
app.use(require("body-parser").urlencoded({extended: false}));

app.get("/", (req, res) =>
	res.render("index.pug", {keyPublishable, website, footerText, name, logo}));

app.post("/charge", (req, res) => {
	var amount = req.body.amount;

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

app.listen(port);