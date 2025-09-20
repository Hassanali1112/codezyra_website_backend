import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connect_DB = async () => {
  try {
    const connectionHost = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(connectionHost)
  } catch (error) {
    console.log("db_error =", error)
    process.exit(1)
  }
};
