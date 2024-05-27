const ytdl = require('ytdl-core');
const fs = require('fs');
const videoUrl = 'https://youtu.be/erEFnY-Lq-c?list=RDMMerEFnY-Lq-c';

// Get video info from YouTube
ytdl.getInfo(videoUrl).then((info) => {
  // Select the video format and quality
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo', container: 'mp4' });
  
  if (!format) {
    throw new Error('Desired format not found');
  }

  // Create a sanitized file name for the video
  const outputFileName = `${info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-')}.${format.container}`;

  // Create a write stream to save the video file
  const outputStream = fs.createWriteStream(outputFileName);

  // Download the video file
  ytdl(videoUrl, { format: format }).pipe(outputStream);

  // When the download is complete, show a message
  outputStream.on('finish', () => {
    console.log(`Finished downloading: ${outputFileName}`);
  });

  outputStream.on('error', (err) => {
    console.error(`Error writing to the file: ${err.message}`);
  });

}).catch((err) => {
  console.error(`Error fetching video info: ${err.message}`);
});
