const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use('/img', express.static('img'));
app.use('/public', express.static('public'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/img`,
    }),
    limits: {
        fileSize: 104857600,
    },
    fileFilter: function (req, file, callback) {
        const supportedFiletypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
        if (supportedFiletypes.indexOf(file.mimetype) < 0) {
            if (!req.skippedFiles) {
                req.skippedFiles = [file.originalname];
            } else {
                req.skippedFiles.push(file.originalname);
            }
            return callback(null, false);
        }
        callback(null, true);
    },
});

// Main route
app.get('/', (req, res) => {
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic');
        res.sendStatus(401);
    };

    const authorization = req.headers.authorization;

    if (!authorization) {
        return reject();
    }

    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':');

    if (!(username === process.env.APP_USERNAME && password === process.env.APP_PASSWORD)) {
        return reject();
    }

    res.render('index', {
        alert: null,
    });
});

// EJS route
app.post('/', upload.single('image'), (req, res) => {
    const file = req.file;
    if (file) {
        const type = file.mimetype.split('/');
        const name = randomString(10);
        fs.renameSync(`${__dirname}/img/${file.filename}`, `${__dirname}/img/${name}.${type[1]}`);
        res.redirect(`/${name}.${type[1]}`);
    } else {
        res.render('index', {
            alert: 'Only GIF, JPEG/JPG and PNG are allowed.',
        });
    }
});

// File display route
app.get('/:filename', (req, res) => {
    try {
        const fileName = req.params.filename;
        const fileStats = fs.statSync(`${__dirname}/img/${fileName}`);
        const fileDate = `${fileStats.birthtime.toDateString()}, ${fileStats.birthtime.getHours()}:${fileStats.birthtime.getMinutes()}`;
        const fileSize = Math.round((fileStats.size / (1024 * 1024)) * 100) / 100;
        res.render('viewer', {
            fileName: fileName,
            fileSize: fileSize,
            fileDate: fileDate,
            randomHexColor: randomHexColor(),
            description: `${fileName} uploaded at ${fileDate}`,
        });
    } catch (error) {
        // res.redirect('/');
        // console.log(error);
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

function randomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function randomString(length) {
    const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
