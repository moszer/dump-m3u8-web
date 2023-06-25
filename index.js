const express = require('express');
const path = require("path");
const app = express();
const port = 3006;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const comBile_ = require('./Combile_ts');

app.use(express.static('public'));

const {
  mParser,
  mDownloader,
  mIndicator,
} = require("node-m3u8-to-mp4");

let data_loading = "0.0";

// Emit data loading progress to connected clients
function emitDataLoadingProgress(progress) {
  io.emit('data_loading_progress', progress);
}

// Force download m3u8 to ts file
function force_download_m3u8(Link_, referer_) {
  // Set progress indicators
  mIndicator("downloading", (index, total) => {
    const progress = ((index / total) * 100).toFixed(2) + "%";
    console.log("downloading:", progress, "index:", index, "total:", total);
    data_loading = ((index/ total) * 100).toFixed(2)
    emitDataLoadingProgress(data_loading);
  });

  // Parse the video resource list
  mParser(Link_, {
    referer: referer_,
  }).then((list) => {
    // Extract the URLs from the resource list
    const medias = list.map((item) => `${item.url}`);
    console.log("Extracted");

    // Download the media files
    mDownloader(medias, {
      targetPath: path.resolve(".target"),
      headers: {
        referer: referer_,
      },
    })
      .then(() => {
        console.log("load ts file success");
        emitDataLoadingProgress("Load ts file success");
      })
      .catch((e) => {
        console.log("Force Failed");
        emitDataLoadingProgress("Force Failed");
      });
  });
}

force_download_m3u8("https://live-par-2-abr.livepush.io/vod/bigbuckbunny/bigbuckbunny.840x480.mp4/tracks-v1a1/mono.m3u8", "https://livepush.io/");

// Send the data_loading value to connected clients initially
io.on('connection', (socket) => {
  socket.emit('data_loading_progress', data_loading);
  //get event in html file
  socket.on('button_click', () => {
    console.log('Button clicked');
    //
    comBile_();
  });
});

//download file
app.get('/download', (req, res) => {
    res.download("output/output_clip.ts")
});

// Start the server
http.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app