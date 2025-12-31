import dotenv from "dotenv";

// ✅ Load env FIRST
dotenv.config({ path: "./.env" });

// 🔍 TEMP DEBUG (ADD HERE)
// console.log("Cloudinary ENV CHECK:", {
//   cloud: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: !!process.env.CLOUDINARY_API_SECRET,
// });

// // 🔍 TEMP DEBUG (Mongo)
// console.log("MONGO_URI =", process.env.MONGO_URI);

// ✅ THEN import rest
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !!!", err);
  });




/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/