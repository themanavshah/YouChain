const express = require('express');
//const actions = require('../methods/actions');
const router = express.Router()
const fs = require('fs');
const ipfsClient = require('ipfs-http-client').create;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
    const pathx = file.path;
    console.log(typeof pathx)
    var filehash;
    const fileName = req.body.fileName;
    fs.readFile(pathx, 'utf8', function (err, data) {
        // Display the file content
        //console.log(data);

        if (err) {
            console.log(err)
            return -1;
        };
        proccessit(data);

    });
    async function proccessit(file) {
        var buf = Buffer.from(file);
        console.log(buf);
        filehash = await addFile(fileName, buf);
    }


    //console.log(fileHash);
    // fs.unlink(filePath, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    res.json({ filename: fileName, fileHash: filehash });
});

const addFile = async (fileName, file) => {
    //var readable = await fs.createReadStream('file');
    //console.log(readable);
    const fileAdded = await ipfs.add({ path: fileName, content: file })
    //console.log(fileAdded);
    const fileHash = fileAdded.cid.toString();
    console.log(fileHash);

    return fileHash
}

module.exports = router 