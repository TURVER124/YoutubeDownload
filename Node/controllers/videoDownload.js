const express = require('express');
const router = express.Router();
const download = require('../helpers/downloadVideo.js')

router.get('/', async (req, res) => {
    try {

        res.render('index', { status: 'Okay' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {  
        
        const response = ''

        if (req.body.type === 'audio') {
            download.downloadAudio(req.body.url);
        } else if (req.body.type === 'video') {
            download.downloadVideo(req.body.url);
        } else {
            download.downloadAudioAndVideo(req.body.url);
        }

        console.log(response);

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;