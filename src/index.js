import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";

import { connect_DB } from "./database/index.js";

const PORT = process.env.PORT || 5000;

connect_DB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`server is ready at : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("catch error", error);
  });
