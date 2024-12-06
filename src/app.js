import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sử dụng middleware express.static để phục vụ các file tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: `Error: ${err}`,
        status: "error",
      });
    }
    res.send(data);
  });
});

app.get("/product/:id", async (req, res) => {
  const filePath = path.join(__dirname, "detail.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: `Error: ${err}`,
        status: "error",
      });
    }
    res.send(data);
  });
});

app.get("/api/init", async (req, res) => {
  try {
    const { id } = req.query;
    //timeout 1h
    const timeout = 3600000;
    let shouldCallAgain = true;
    const delay = 1000;
    const urlInit = "https://nu.ummn.nu/api/v1/init?p=y&23=1llum1n471";
    const resInit = await axios.get(urlInit, { timeout: timeout });
    console.log(resInit.data, "resInit");
    let redirectURL = "";
    let downloadURL = "";
    const resConvert = await axios.get(
      `${resInit.data.convertURL}&v=https://www.youtube.com/watch?v=${id}&f=mp3&_=0.296221927706`,
      { timeout: timeout }
    );
    if (resConvert.data.downloadURL) {
      downloadURL = resConvert.data.downloadURL;
    }

    // console.log(resConvert.data, "resConvert");
    let dataConvert;
    // if (resConvert.data.redirectURL) {
    //   dataConvert = await axios.get(resConvert.data.redirectURL);
    //   console.log("run line 23");
    // } else {

    //   console.log("run line 26");
    // }
    // // console.log(dataConvert.data, "dataConvert");
    console.log(resConvert.data, "resConvert");

    if (resConvert.data.redirectURL) {
      const redirect = await axios.get(resConvert.data.redirectURL, {
        timeout: timeout,
      });
      // console.log(redirect.data, "redirect");
      redirectURL = redirect.data.redirectURL;
      downloadURL = redirect.data.downloadURL;
    }
    if (resConvert.data.progressURL) {
      while (shouldCallAgain) {
        if (redirectURL) {
          dataConvert = await axios.get(redirectURL, {
            timeout: timeout,
          });
        } else {
          dataConvert = await axios.get(resConvert.data.progressURL, {
            timeout: timeout,
          });
        }
        if (dataConvert.data.progress >= 3) {
          shouldCallAgain = false;
        } else {
          // Nếu dữ liệu nhỏ hơn 3, đợi 1 giây trước khi gọi lại API
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        console.log(dataConvert.data, "dataConvert");
      }
    }

    return res.status(200).json({
      message: "Init API",
      downloadURL,
      // downloadURL: resConvert.data.downloadURL,
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
      status: "error",
    });
  }
});

function mp3Convert(id) {
  // const resConvert = axios.get(url);
  console.log("res progress...", id);
  // return resConvert;
}

// Middleware xử lý 404
app.use((req, res) => {
  const filePath = path.join(__dirname, "404.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: `Error: ${err}`,
        status: "error",
      });
    }
    res.send(data);
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
