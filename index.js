const path = require("path");
const getYouTubeID = require('get-youtube-id');
const { getSubtitles } = require('youtube-captions-scraper');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.gemAPIs;
var dres;
// https://youtu.be/N_sUsq_y10U?si=JXdwUBKxef7K3DiC


const genAi = new GoogleGenerativeAI(API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash"});

async function fetchSubtitles(u,res) {
  try {
    let urlQuery = u;
    let id = await getYouTubeID(urlQuery);
    let captionsData;
    let caption = await getSubtitles({
      videoID: id,
      lang: 'en'
    });
    caption.forEach(caption => {
      captionsData += (`${caption.text}`);
    });
    const prompt = "you are a text to studybook converter. You will be taking the text and provide highly detailed explanations in points within 300 words in the form of study notes. If same text is given again generate again with some changes. The text will be appended here  ";
    const result = await model.generateContent(captionsData,prompt);
    dres = result.response.text();
    // res.json(result.response.text());
    // let abstract = sum({ 'corpus': captionsData });
    // res.send(abstract.summary);
  } catch (error) {
    console.error('Error in fetching subtitles:', error);
  }
}

// async function toHtml(text) {
//   text.replaceAll("\\n","<br>");
// }

const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.get("*", (req,res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.get("/api", (req,res) => {
  let { url } = req.query;
  fetchSubtitles(url,res);
  res.json(dres);
});

// app.get('/display', (req,res) => {
//   let { url } = req.query;
//   let data = fetchSubtitles(url,res);
//   res.render('display', { data: JSON.stringify(data) });
// });

app.listen(PORT, '0.0.0.0', () => console.log('running'));
