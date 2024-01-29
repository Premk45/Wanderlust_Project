const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

let data = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "65aea5500a2a781dfd6da3ad"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}

data();