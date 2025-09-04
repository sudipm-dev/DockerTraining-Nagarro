"use strict";
import dotenv from "dotenv";
import { createClient } from "redis";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

function getSecret(envVar, fileVar) {
  if (process.env[fileVar]) {
    return fs.readFileSync(process.env[fileVar], "utf-8").trim();
  }
  return process.env[envVar] || "";
}
// redis
const redisUsername = process.env.REDIS_USERNAME || "";
const redisPassword = getSecret("REDIS_PASSWORD", "REDIS_PASSWORD_FILE");
const redisHost = process.env.REDIS_HOST || "";
const redisPort = process.env.REDIS_PORT || "";
const redisChannel = process.env.REDIS_CHANNEL || "";

// mysql
const sqlHost = process.env.MYSQL_HOST || "";
const sqlUser = process.env.MYSQL_USERNAME || "";
const sqlPassword = getSecret("MYSQL_PASSWORD", "MYSQL_PASSWORD_FILE");
const sqlRootPassword = getSecret("MYSQL_ROOT_PASSWORD", "MYSQL_ROOT_PASSWORD_FILE");
const sqlDatabase = process.env.MYSQL_DATABASE || "";
const sqlTable = process.env.MYSQL_TABLE || "";



// configs
const redisUrl = `redis://:${redisPassword}@${redisHost}:${redisPort}`;
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: sqlPassword || sqlRootPassword,
  database: process.env.MYSQL_DATABASE,
};


// helper fn for DB
const createData = async (data) => {
  const sqlQuery = `INSERT INTO ${sqlTable} (data) VALUES ('${data}')`;
  const sqlConnection = await mysql.createConnection(dbConfig);
  return sqlConnection.execute(sqlQuery);
};

(function () {
  const subscriber = createClient({ url: redisUrl });
  subscriber.connect();

  // redis status logger
  subscriber.on("error", (err) => console.log("Redis error", err));
  subscriber.on("connect", () => console.log("\n Connected to Redis \n"));
  subscriber.on("reconnecting", () => {
    console.log("\nReconnecting to Redis.\n");
  });
  subscriber.on("ready", () => {
    console.log("\n Redis ready for action! \n");
    // call back fn is required
    subscriber.subscribe(redisChannel, async (message) => {
      console.log("subscriber service:- ", message);
      try {
        await createData(message);
      } catch (error) {
        console.log({ error });
      }
    });
  });
})();
