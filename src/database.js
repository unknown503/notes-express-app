const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/webapp-node", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connected"))
    .catch(err => console.log(err));