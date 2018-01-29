const config = require("./config.js")
const package = require('./package.json');

const version = package.version;

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

var recentName = ""
var recentAmount = 0

app.set("view engine", "pug");
app.use(express.static('public'));
app.use(require("body-parser").urlencoded({extended: false}));

app.get("/", (req, res) =>
	res.render("index.pug", {keyPublishable, website, footerText, name, logo, version}));

app.get("/recent", (req, res) =>
	res.render("recent.pug", {recentAmount, recentName}));

app.post("/charge", (req, res) => {
	var amount = req.body.amount;
	recentAmount = amount/100;
	recentName = req.body.name;
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