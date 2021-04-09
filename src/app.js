
const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const {convertWordFiles,} = require("convert-multiple-files");

let filename;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        filename =file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename)
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

app.post('/doc', upload.single('file'),async (req,res)=> {
    try{

        try{
    await convertWordFiles(path.resolve(__dirname,`../public/uploads/${filename}`), 'pdf',path.resolve(__dirname,`../public/converted`))
        }catch(err){
            console.log(err)
        }

    return res.send(req.file)

    }catch(error)
    {
        res.send({
            error
        })
    }
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})