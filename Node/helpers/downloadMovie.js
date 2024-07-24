const youtubedl = require('youtube-dl-exec');
const path = require('path');

const title = "IceAgeOne"
const m3u8Url = 'https://s31.upstreamcdn.co/hls2/01/04424/40axzgbvkra1_n/master.m3u8?t=8r7ZFB5kQG9FXLnKQPriQyanpg_C8hA6E1dlU0XYhoU&s=1720130396&e=10800&f=22123669&i=82.39&sp=0';
const sanitizedTitle = title.replace(/[\/\\?%*:|"<>]/g, '-');
const outputFilename = path.join('/srv/samba/FileStore/Movies', `${sanitizedTitle}.mp4`);

console.log('Starting download process...');

youtubedl(m3u8Url, {
    output: outputFilename
})
.then(output => {
    console.log('Download complete:', output);
})
.catch(err => {
    console.error('Error downloading video:', err);
});
