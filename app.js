const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');

require('dotenv').config();

// Models
const shortenUrl = require('./models/shortenUrl');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
// setting up ejs mate
app.engine("ejs", ejsMate);
// setting views and public paths
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// reading post requests data using urlencoding
app.use(express.urlencoded({ extended: true }));
// setting method override variable to be able to override post request to put, patch, delete and others
app.use(methodOverride("_method"));

// Connecting MongoDB
main()
    .then((res) => {
        console.log("Connection established (Mongoose connection)");
    })
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGODB_URI)
}

app.get("/", async (req, res) => {
    const data = await shortenUrl.find({});
    res.render("index", { data: data });
});

app.post("/shortenUrl", async (req, res) => {
    const { originalUrl } = req.body;
    console.log(originalUrl);
    const newUrl = await shortenUrl.create({ originalUrl: String(originalUrl) }).then(() => {
        res.redirect('/');
    }).catch((err) => {
        res.status(500).send(err.message);
    });

});

app.get("/:shortUrl", async (req, res) => {
    await shortenUrl.findOne({ shortenUrl: req.params.shortUrl }).then((data) => {
        data.clicks++;
        data.save().then(
            res.redirect(data.originalUrl)
        )
    }).catch((err) => {
        res.status(404).send(err.message);
    });
})

app.listen(port, () => {
    console.log("Server is listening on port " + port);
});