import { exit } from "node:process";
import db from "../config/db.js";
import usuario from "./users.js";
import {Users} from "../models/asociaciones.js";

const importData = async () => {
  try {
    await db.authenticate();

    await db.sync();

    await Promise.all([Users.bulkCreate(usuario)]);

    console.log("datos importados");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if(process.argv[2] === "-i"){
    importData()
}