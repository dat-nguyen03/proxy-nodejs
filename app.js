import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get("/api/init", async (req, res) => {
  const { id } = req.query;
  // console.log(dat);
  const urlInit = "https://nu.ummn.nu/api/v1/init?p=y&23=1llum1n471";
  const convertUrl = `https://uunu.ummn.nu/api/v1/convert`;
  const resInit = await axios.get(urlInit);
  let sig = resInit.data.convertURL.split("?sig=")[1];
  // console.log(sig, "sig");
  const resConvert = await axios.get(
    `${convertUrl}?sig=${sig}&v=https://www.youtube.com/watch?v=${id}&f=mp3&_=0.296221927706`
  );
  // console.log(resConvert.data.redirectURL, "resConvert");
  const dataConvert = await axios.get(resConvert.data.redirectURL);
  return res.status(200).json({
    message: "Init API",
    downloadURL: dataConvert.data.downloadURL,
    status: "success",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
