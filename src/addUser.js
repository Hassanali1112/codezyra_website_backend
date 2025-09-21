import dotenv from "dotenv"
dotenv.config()

import { connect_DB } from "./database/index.js";
import { User } from "./models/user.model.js";


const name = process.env.USER_NAME;
const email = process.env.EMAIL_USER;
const password = process.env.USER_PASS;

const addAdmin = async ()=>{
  try {
    const admin = await User.create({
      name,
      email,
      password,
    })

    console.log("admin added successfully",)
  } catch (error) {
    console.log("admin creation error :", error)
  }
}
connect_DB()
.then(async()=>{
 addAdmin()
})