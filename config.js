const { exec } = require("child_process");
const fs = require("node:fs");
const contentPackage = `{
  "name": "node",
  "description": "APIRestFul",
  "version": "1.0.0",
  "main": "./src/http/server.js",
  "license": "MIT",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch ./",
    "start": "node --watch ./"
  }
}`;

exec("yarn init -yp");
fs.writeFileSync("package.json", "");
fs.writeFileSync("package.json", contentPackage);
exec(
  "yarn add express jsonwebtoken dotenv compression mongoose bcryptjs cors express-validator"
);
const contentEnv =
  "PORT=3000\nJWT_SECRET=Vitovo\nEMAIL_ADMIN=vittorserradev@gmail.com\nPASSWORD_ADMIN=Vitovo100%\nMONGO_URL=mongodb://127.0.0.1:27017/\nMONGO_NAME=Curso";
const contentEnvExample =
  "PORT=****\nJWT_SECRET=****\nEMAIL_ADMIN=****\nPASSWORD_ADMIN=****\nMONGO_URL=****\nMONGO_NAME=****";

fs.writeFileSync(".env", contentEnv);
fs.writeFileSync(".env.example", contentEnvExample);
fs.mkdirSync("rest");
fs.mkdirSync("src");
const folders = [
  "routes",
  "models",
  "controller",
  "utils",
  "database",
  "http",
  "logs",
];
folders.forEach((item) => {
  fs.mkdirSync(`src/${item}`, { recursive: true });
});
fs.mkdirSync("src/routes/v1", { recursive: true });
const fileIndexRoute = `import { Router } from "express";
const router = Router();
export default router;`;
fs.writeFileSync("src/routes/v1/index.js", fileIndexRoute);
const fileServerHttp = `import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import cors from "cors";

import { createServer } from "node:http";
const serverHTTP = createServer(app);

import router from "../routes/v1/index.js";
import conn from "../database/conn.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.disable("x-powered-by");

app.use("/api/v1/", (req, _, next) => {
  console.log(\`Path: \${req.path} | Method: \${req.method}\`);
  next();
});
app.use("/api/v1/", router);

const port = process.env.PORT;

serverHTTP.listen(port, async () => {
  console.log(\`O servidor está rodando na porta \${port}.\`);
  await conn();
});`;
fs.writeFileSync("src/http/server.js", fileServerHttp);
const contentUserModel = `import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;`;
fs.writeFileSync("src/models/userModel.js", contentUserModel);
const contentConnMongo = `import mongoose from "mongoose";

const conn = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.MONGO_NAME,
    })
    .then(() => {
      console.log("Banco de dados sincronizado com sucesso!");
    })
    .catch((error) => {
      console.log(
        "Não foi possível sincronizar o banco de dados.",
        error.message
      );
    });
};

export default conn;`;
fs.writeFileSync("src/database/conn.js", contentConnMongo);
const contentGitIgnore = "node_modules/\n.env\nrest/";
fs.writeFileSync(".gitignore", contentGitIgnore);
fs.createWriteStream(".README.MD");
fs.createWriteStream("LICENSE");
fs.unlinkSync("config.js");
