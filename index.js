require("dotenv").config();
const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const cloudinary=require("cloudinary").v2

app.set("view engine", "ejs"); // To use ejs template

// cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // extended is used if we are sending bunch of data in a extended form
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
// routes

app.get("/myget", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});
app.post("/mypost", async (req, res) => {
    try {
        let result;
        let imageArray=[];
        const file = req.files.File;
        console.log("file:", file);

        // If part will work when there will be more than 1 image to be uploaded
        if (file.length > 1) {
          for (let index = 0; index < file.length; index++) {
            result = await cloudinary.uploader.upload(
              file[index].tempFilePath,
              {
                folder: "users",
              }
            );
            console.log("result: ", result);
            imageArray.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        } else {
          result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
          });
          imageArray.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
        console.log("result: ",result)
        console.log("imageArray: ", imageArray);
         res.send(imageArray);
    }
    catch (error) {
        console.log("error: ",error)
    }
});

app.get("/getform", (req, res) => {
  res.render("getForm");
});

app.get("/postform", (req, res) => {
  res.render("postForm");
});

app.listen(4000, () => {
  console.log("App running @4000...");
});
