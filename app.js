const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// const uri =
//   "mongodb+srv://testmongoDB:BircanAli@cluster0.zxyyhay.mongodb.net/testDB?retryWrites=true&w=majority";

// async function connect() {
//   try {
//     await mongoose.connect(uri);
//     console.log("connected to Mongodb");
//   } catch (err) {
//     console.error(err);
//   }
// }
// connect();

mongoose.set("strictQuery", true);

mongoose.connect(
  "mongodb://127.0.0.1:27017/userDB",
  {
    useNewUrlParser: true,
  },
  console.log("connected to mongoDB")
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundOne) {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        if (foundOne.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen("3000", function () {
  console.log("Connected at port 3000");
});
