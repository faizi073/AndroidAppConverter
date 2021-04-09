
const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const {convertWordFiles,} = require("convert-multiple-files");
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });


app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello from my app express server!")
})

app.post('/doc', upload.single('file'),function(req,res) {
    try{
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    convertWordFiles(req.file.path, 'pdf','./public/converted')

    return res.send(req.file);
    }catch(error)
    {
        res.send(req.file.path + "   HERREEE")
    }
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})