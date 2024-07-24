const express = require("express");
const app = express();
const session = require("express-session");
const user = require("./model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypt0 = require("crypto");
const bodyParser = require("body-parser");
const ejs = require("ejs");
dotenv.config({ path: require("path").resolve(__dirname, "./.env") });
const db = require("./db");

const proxy = require("./proxy");
app.use(express.json());

app.set("view engine", "ejs");
app.get("/login", (req: any, res: any) => {
  try {
    res.render("login");
  } catch (err) {
    return res
      .status(500)
      .send({ status: 500, error: err, message: "Internal Server Error" });
  }
});
app.get("/register", (req: any, res: any) => {
  try {
    res.render("register");
  } catch (err) {
    return res
      .status(500)
      .send({ status: 500, error: err, message: "Internal Server Error" });
  }
});
app.get("/", (req: any, res: any) => {
  try {
    res.render("home");
  } catch (err) {
    return res
      .status(500)
      .send({ status: 500, error: err, message: "Internal Server Error" });
  }
});
app.use(
  session({
    secret: "b03233ba154254bcaeb87d58ad7a7d8120d51e50",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

db.then(() => {
  app.post("/login", async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res
          .status(400)
          .send({ status: 400, message: "Email is required" });
      }
      if (!password) {
        return res
          .status(400)
          .send({ status: 400, message: "Password is required" });
      }
      const userInfo = await user.findOne({ email: email });
      if (!userInfo) {
        return res.status(401).send({
          status: 401,
          message: "Please correct your email address",
        });
      }
      const verifyPassword = await bcrypt.compare(password, userInfo.password);
      if (userInfo && verifyPassword) {
        if (userInfo.token) {
          return res.status(200).send({
            status: 200,
            token: userInfo.token,
            message: "Already login",
          });
        }
        const { clientID, clientSecretKey } = userInfo;
        const authCode = await jwt.sign(
          { email, clientID, clientSecretKey },
          process.env.secretKey
        );
        const userInfoUpdate = await user.updateOne(
          { email: email },
          { $set: { token: authCode } }
        );

        if (userInfoUpdate.modifiedCount) {
          return res.status(200).send({
            status: 200,
            message: "successfully login",
            authCode: authCode,
          });
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, message: "Please correct your password" });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ status: 500, message: "Internal Server Error", error: err });
    }
  });

  app.post("/register", async (req: any, res: any) => {
    try {
      const { name, password, email } = req.body;
      if (!name) {
        return res
          .status(400)
          .send({ status: 400, message: "Name is required" });
      }
      if (!password) {
        return res
          .status(400)
          .send({ status: 400, message: "Password is required" });
      }
      if (!email) {
        return res
          .status(400)
          .send({ status: 400, message: "Email Address is required" });
      }

      const userInfo = await user.findOne({ email: email });
      if (userInfo) {
        return res
          .status(400)
          .send({ status: 400, message: "User is already register" });
      }

      let clientID = jwt.sign(
        { email: email, name: name },
        process.env.secretKey
      );

      let clientSecretKey = jwt.sign(
        { email, name, clientID },
        process.env.secretKey
      );
      const encryptPassword = await bcrypt.hash(password, 10);
      const userDetails = await user({
        email,
        password: encryptPassword,
        name,
        clientID,
        clientSecretKey,
        createdAt: Date.now(),
      }).save();

      if (userDetails) {
        return res
          .status(200)
          .send({ status: 200, message: "Successfully saved record" });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ status: 500, message: "Internal Server Error", error: err });
    }
  });

  app.post("/getUser", async (req: any, res: any) => {
    try {
      const { email, token } = req.body;
      if (!email) {
        return res
          .status(400)
          .send({ status: 400, message: "Email Address is required" });
      }
      if (!token) {
        return res
          .status(400)
          .send({ status: 400, message: "Token is required" });
      }

      const userInfo = await user.findOne(
        { email: email, token: token },
        { password: 0, clientID: 0, clientSecretKey: 0, token: 0 }
      );
      if (!userInfo) {
        return res
          .status(404)
          .send({ status: 404, message: "User information is not found" });
      }
      return res.status(200).send({ status: 200, data: userInfo });
    } catch (err) {
      return res
        .status(500)
        .send({ status: 500, message: "Internal Server Error", error: err });
    }
  });

  app.post("/changePassword", async (req: any, res: any) => {
    try {
      const { email, token, newPassword, oldPassword } = req.body;
      if (!email) {
        return res
          .status(400)
          .send({ status: 400, message: "Email Address is required" });
      }
      if (!token) {
        return res
          .status(400)
          .send({ status: 400, message: "Token is required" });
      }

      if (!newPassword) {
        return res
          .status(400)
          .send({ status: 400, message: "Password is required" });
      }
      if (!oldPassword) {
        return res
          .status(400)
          .send({ status: 400, message: "Current Password is required" });
      }

      const userInfo = await user.findOne(
        { email: email, token: token },
        { password: 1, token: 1 }
      );
      if (!userInfo) {
        return res
          .status(404)
          .send({ status: 404, message: "User information is not found" });
      }
      const checkPassword = await bcrypt.compare(
        oldPassword,
        userInfo.password
      );

      if (!checkPassword) {
        return res
          .status(400)
          .send({ message: "Please check your password", status: 400 });
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await user.updateOne(
        { email },
        { $set: { password: hashPassword } }
      );
      if (!updateUser.modifiedCount) {
        return res.status(400).send({
          status: 400,
          message: "Password you set is already set in password",
        });
      }
      return res
        .status(200)
        .send({ status: 200, message: "Password is changed successfully" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: 500, message: "Internal Server Error", error: err });
    }
  });

  app.post("/logout", async (req: any, res: any) => {
    try {
      const { token, email } = req.body;
      const deleteUserToken = await user.updateOne(
        { email },
        { $set: { token: null } }
      );
      if (!deleteUserToken.modifiedCount) {
        return res
          .status(400)
          .send({ status: 400, message: "Something went wrong" });
      }
      return res
        .status(200)
        .send({ status: 200, message: "logout successfully" });
    } catch (err) {
      return res
        .status(500)
        .send({ status: 500, message: "Internal Server Error", error: err });
    }
  });

  app.listen(process.env.port, () => {
    console.log("Server is Listening on " + process.env.port);
  });
}).catch((err: any) => {
  console.log("ERROR: ", err);
});
