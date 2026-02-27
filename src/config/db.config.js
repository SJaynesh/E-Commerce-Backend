const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB is connected...");
}).catch((err) => {
    console.log("DB is not connected...");
    console.log("Error : ", err);
});