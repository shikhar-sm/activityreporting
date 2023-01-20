
const express = require('express')
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
//const reader = require('xlsx')
const app = express()
const path = require('path')
const port = 3000

const Excel = require('exceljs')
const exp = require('constants')

/*const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://activityreport:lV142eAUaQTcnV1y@cluster0.cju0own.mongodb.net/?retryWrites=true&w=majority');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const dataschema = new mongoose.Schema({
    oname: String,
    evname: String,
    evdate: Date,
    nat: Number,
    filname: String,
    edate: Date
})

const data = mongoose.model('Data', dataschema)

function insert(td) {
    td.save(function (err) {
        res.status(500).send(err)
    })
}*/

app.use(fileUpload())
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static('public'))
app.use(express.static('uploads'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/summary', (req, res) => {
    res.sendFile(__dirname + '/summary.xlsx')
})

/*app.get('/*.pdf', (req, res) => {
    console.log(req.baseUrl)
    res.sendFile(__dirname + '/uploads/' + req.baseUrl, function (err) {
        if (err)
            return res.status(404).send()
    })
})*/

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/error.html')
})


app.post('/login', urlencodedParser, (req, res) => {
    console.log("login")
    app.locals.uname = req.body.uname
    res.sendFile(__dirname + '/index.html')
})

app.post('/upload', (req, res) => {
    console.log(app.locals.uname)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
    }
    let report = req.files.fil
    app.locals.filname = Date.now() + '.pdf'
    report.mv('uploads/' + app.locals.filname, function (err) {
        if (err)
            return res.status(500).send(err)
    })
    app.locals.evdate = req.body.evdate
    app.locals.nat = req.body.nat
    app.locals.oname = req.body.oname
    app.locals.evname = req.body.evname
    app.locals.edate = new Date()
    var td = [
        app.locals.uname,
        app.locals.oname,
        app.locals.evname,
        app.locals.evdate,
        app.locals.nat,
        app.locals.filname,
        app.locals.edate
    ]
    var workbook = new Excel.Workbook();

    workbook.xlsx.readFile(__dirname + '/summary.xlsx')
        .then(function () {
            var worksheet = workbook.getWorksheet(1); // A5's value set to 5
            worksheet.addRow(td)
            return workbook.xlsx.writeFile(__dirname + '/summary.xlsx');
        })
    //insert(td)
    //const file = reader.readFile(__dirname + '/summary.xlsx')
    //reader.utils.sheet_add_json(file, td)
    //reader.writeFile(file, __dirname + '/summary.xlsx')
    console.log(app.locals.evdate)
    console.log(app.locals.nat)
    console.log(app.locals.oname)
    console.log(app.locals.evname)
    console.log(app.locals.edate)
    res.sendFile(__dirname + '/index.html')
})
//lV142eAUaQTcnV1y

app.post('*', (req, res) => {
    res.sendFile(__dirname + '/error.html')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

