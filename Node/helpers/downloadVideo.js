const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

async function downloadAudioAndVideo(videoUrl) {
    try {
        // Get video info from YouTube
        const info = await ytdl.getInfo(videoUrl);

        // Select the highest quality video and audio formats
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoonly', container: 'mp4' });
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly', container: 'mp4' });

        if (!videoFormat || !audioFormat) {
            throw new Error('Desired format not found');
        }

        // Create a sanitized file name for the video
        const sanitizedTitle = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
        const videoOutputPath = path.join('/srv/samba/FileStore/Youtube/_TEMP', `${sanitizedTitle}_video.mp4`);
        const audioOutputPath = path.join('/srv/samba/FileStore/Youtube/_TEMP', `${sanitizedTitle}_audio.mp4`);
        const finalOutputPath = path.join('/srv/samba/FileStore/Youtube', `${sanitizedTitle}.mp4`);

        // Download the video and audio files separately
        const videoStream = ytdl(videoUrl, { format: videoFormat });
        const audioStream = ytdl(videoUrl, { format: audioFormat });

        // Create writable streams for the downloaded video and audio files
        const videoFile = fs.createWriteStream(videoOutputPath);
        const audioFile = fs.createWriteStream(audioOutputPath);

        // Pipe the video and audio streams to their respective files
        videoStream.pipe(videoFile);
        audioStream.pipe(audioFile);

        // Wait for both downloads to complete
        await Promise.all([
            new Promise((resolve, reject) => {
                videoFile.on('finish', resolve);
                videoFile.on('error', reject);
            }),
            new Promise((resolve, reject) => {
                audioFile.on('finish', resolve);
                audioFile.on('error', reject);
            })
        ]);

        // Merge the video and audio files using ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(videoOutputPath)
                .input(audioOutputPath)
                .output(finalOutputPath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // Clean up temporary files
        await Promise.all([
            fs.promises.unlink(videoOutputPath),
            fs.promises.unlink(audioOutputPath)
        ]);

        console.log(`Finished merging video and audio: ${finalOutputPath}`);

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function downloadAudio(videoUrl) {
    try {
        // Get video info from YouTube
        const info = await ytdl.getInfo(videoUrl);

        // Select the highest quality audio format
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly', container: 'mp4' });
        
        if (!audioFormat) {
            throw new Error('Desired audio format not found');
        }

        // Create a sanitized file name for the audio
        const sanitizedTitle = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
        const outputFileName = `${sanitizedTitle}.mp4`;
        const outputFilePath = path.join('/srv/samba/FileStore/Youtube/_TEMP', outputFileName);

        // Temporary path for the MP3 conversion
        const mp3FileName = `${sanitizedTitle}.mp3`;
        const mp3FilePath = path.join('/srv/samba/FileStore/Youtube', mp3FileName);

        // Download the audio file
        const audioStream = ytdl(videoUrl, { format: audioFormat });
        const audioFile = fs.createWriteStream(outputFilePath);

        // Pipe the audio stream to the file
        audioStream.pipe(audioFile);

        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
            audioFile.on('finish', resolve);
            audioFile.on('error', reject);
        });

        // Convert the downloaded audio file to MP3 using ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(outputFilePath)
                .toFormat('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(mp3FilePath);
        });

        // Delete the original downloaded file
        await fs.promises.unlink(outputFilePath);

        console.log(`Finished downloading and converting audio to MP3: ${mp3FilePath}`);

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function downloadVideo(videoUrl) {
    try {
        // Get video info from YouTube
        const info = await ytdl.getInfo(videoUrl);

        // Select the highest quality audio format
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoonly', container: 'mp4' });
        
        if (!audioFormat) {
            throw new Error('Desired audio format not found');
        }

        // Create a sanitized file name for the audio
        const sanitizedTitle = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
        const outputFileName = `${sanitizedTitle}.mp4`;

        // Define the output file path
        const outputFilePath = path.join('/srv/samba/FileStore/Youtube', outputFileName);

        // Download the audio file
        const audioStream = ytdl(videoUrl, { format: audioFormat });
        const audioFile = fs.createWriteStream(outputFilePath);

        // Pipe the audio stream to the file
        audioStream.pipe(audioFile);

        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
            audioFile.on('finish', resolve);
            audioFile.on('error', reject);
        });

        console.log(`Finished downloading video: ${outputFilePath}`);

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}


module.exports = {
    downloadAudioAndVideo,
    downloadAudio,
    downloadVideo
};