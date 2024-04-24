import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get("/api/init", async (req, res) => {
  const { id } = req.query;
  // console.log(dat);
  const urlInit = "https://nu.ummn.nu/api/v1/init?p=y&23=1llum1n471";
  const convertUrl = `https://uunu.ummn.nu/api/v1/convert`;
  const resInit = await fetch(urlInit).then((res) => res.json());
  let sig = resInit.convertURL.split("?sig=")[1];
  console.log(sig);
  const resConvert = await fetch(
    `${convertUrl}?sig=${sig}&v=https://www.youtube.com/watch?v=${id}&f=mp3&_=0.296221927706`
  ).then((res) => res.json());
  console.log(resConvert.redirectURL);
  const dataConvert = await fetch(resConvert.redirectURL).then((response) =>
    response.json()
  );
  return res.status(200).json({
    message: "Init API",
    downloadURL: dataConvert.downloadURL,
    status: "success",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
