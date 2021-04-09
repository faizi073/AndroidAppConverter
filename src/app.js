const path = require('path')
const express = require('express')
const multer = require('multer')
const fs= require('fs')


const debug = require('debug')('myapp:server');
const logger = require('morgan');
const serveIndex = require('serve-index')

const app = express()


let filename;


const {convertWordFiles,} = require("convert-multiple-files");

//set path of views and static assests
const publicDirectoryPath = path.join(__dirname, '../public')

//Use static assests like css,client side js, images
app.use(express.static(publicDirectoryPath))


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        filename=(file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        cb(null, filename)
    }
});





  


//will be using this for uplading

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx|ppt|pdf)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    },
    storage
})


app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello BRO")
})


app.post('/doc',upload.single('file'),async (req,res)=>
{
    try {


        console.log(path.join(__dirname,`../public/uploads/${filename}`) + "  Y1122")

        console.log(__filename + "HERE")
        await convertWordFiles(path.join(__dirname,`../public/uploads/${filename}`), 'pdf', path.join(__dirname,'../public/converted'))


        PDFFileName = filename.substr(0, filename.lastIndexOf(".")) + ".pdf";

        FTPPath= (req.hostname  + `/FTP/converted/${PDFFileName}`);

        console.log(FTPPath + "YOO")

        res.send(FTPPath);

    }catch (error) {

        console.log(error + "HERE")
          res.send(__filename + "  ///  "+ __dirname )
    } 


})










const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})
