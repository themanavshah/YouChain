const express = require('express');
//const actions = require('../methods/actions');
const router = express.Router()
const fs = require('fs');
const ipfsClient = require('ipfs-http-client').create;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
//console.log(ipfs);

router.get('/', (req, res) => {
    res.send('ipfs getting started');
})

router.get('/dashboard', (req, res) => {
    res.send('dashboard');
})

router.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.file)
    const file = req.file;
    const fileName = req.body.fileName;
    const filePath = 'uploads/' + file.filename;

    const fileHash = await addFile(fileName, filePath);
    //console.log(fileHash);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.json({ filename: fileName, fileHash: fileHash });
});

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file })
    //console.log(fileAdded);
    const fileHash = fileAdded.cid.toString();
    console.log(fileHash);

    return fileHash
}

module.exports = router