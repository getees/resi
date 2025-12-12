const express = require("express")
const fs = require("node:fs")
const {createServer} = require("node:http")
const {Server, Socket} = require("socket.io")
const path = require("node:path")
const convertjson = require("csvtojson")
const fileUpload = require("express-fileupload")
import { httpServerHandler } from 'cloudflare:node';
const log = require("./logger.js")

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = 3000

app.use(fileUpload())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


async function convertCSV(){
    const file = fs.readdirSync("./csv")
    if (!fs.existsSync("./converted.json")){
        const jsonArray = await convertjson().fromFile("./csv/"+file[0]);
        fs.writeFileSync("./converted.json", JSON.stringify(jsonArray))
        fs.unlinkSync("./csv/"+file[0])
        return true
    } else {
        return false
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*app.get("/", async(req, res)=> {
    const file = fs.readdirSync("./csv")
    let title = ""
    let Jsonfile;
    if (file.length == 1) {
    title = file[0]
    if (!fs.existsSync("./converted.json")){
        const jsonArray=await convertjson().fromFile("./csv/"+file[0]);
        fs.writeFileSync("./converted.json", JSON.stringify(jsonArray))
    }
    Jsonfile = JSON.parse(fs.readFileSync("./converted.json").toString())
    } else {
    title = "Resi Checker"
    Jsonfile = []
}
    res.render("index", {title: title,list: Jsonfile, key: Object.keys(Jsonfile[0] || "")})
})
*/    
// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------
// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------
// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------
app.get("/", async(req, res)=> {
const check = fs.existsSync("./converted.json")
let checked = []
let json = []
if (check) {
json = JSON.parse(fs.readFileSync("./converted.json").toString())
checked = json.filter( element => element["Checked Status"] == "Checked")
}
log("Dashboard Accessed", "cyan")
res.render("index", {checked: check?checked.length:0, unchecked: check?json.length-checked.length:0, total: check?json.length:0, check:check, json: check?json:[]})
})

app.get("/scan", (req, res) => {
    key = JSON.parse(fs.readFileSync("./key.json").toString())
    log("Scan Accessed", "cyan")
    res.render("scan",{key: key})
})

app.get("/tableall", (req, res) => {
    const dt = new Date()
    let json = []
    key = JSON.parse(fs.readFileSync("./key.json").toString())
    if (fs.existsSync("./converted.json")) {
    json = JSON.parse(fs.readFileSync("./converted.json").toString())
    }
    log("Table Accessed", "cyan")
    res.render("alltable", {key: key, json: json, title: "Laporan resi_"+dt.getDate()+"_"+dt.getMonth()+":"+dt.getFullYear()})
})

app.get("/checked", (req, res) => {
    const dt = new Date()
    let json = []
    key = JSON.parse(fs.readFileSync("./key.json").toString())
    if (fs.existsSync("./converted.json")) {
    json = JSON.parse(fs.readFileSync("./converted.json").toString())
    }
    log("Checked Accessed", "cyan")
    res.render("checked", {key: key, json: json, title: "Laporan resi (Checked)_"+dt.getDate()+"_"+dt.getMonth()+":"+dt.getFullYear()})
})

app.get("/unchecked", (req, res) => {
    const dt = new Date()
    let json = []
    key = JSON.parse(fs.readFileSync("./key.json").toString())
    if (fs.existsSync("./converted.json")) {
    json = JSON.parse(fs.readFileSync("./converted.json").toString())
    }
    log("Unchecked Accessed", "cyan")
    res.render("unchecked", {key: key, json: json, title: "Laporan resi (Unchecked)_"+dt.getDate()+"_"+dt.getMonth()+":"+dt.getFullYear()})
})

app.get("/searching", (req, res) => {
    const dt = new Date()
    let json = []
    key = JSON.parse(fs.readFileSync("./key.json").toString())
    if (fs.existsSync("./converted.json")) {
    json = JSON.parse(fs.readFileSync("./converted.json").toString())
    }
    log("Search Accessed", "cyan")
    res.render("search", {key: key, json: json})
})

// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------
// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------
// TAMPILAN ---------------------------------------------------------------------------------------------------------------------------------------------

app.get("/reset", (req, res)=> {
    try {
    const checkJSON = fs.existsSync("./converted.json")
    if (checkJSON) {
    fs.unlinkSync("./converted.json")
    log("RESET SUCCESS", "red")
    res.send({code: 200, reason: "Success"})
    } else {
    res.send({code: 404, reason: "Not Found"})
    }
    } catch(err) {
    res.send({code: 404, reason: err})
    }
})


app.get("/search", (req, res)=> {
    const json = JSON.parse(fs.readFileSync("./converted.json").toString())
    var data_filter = json.filter( element => element["Tracking ID"] == req.query.query)
    log("SEARCH FOR : "+req.query.query, "yellow")
    res.send(data_filter)
})
app.get("/push", (req, res)=> {
    const json = JSON.parse(fs.readFileSync("./converted.json").toString())
    var data_filter = json.filter( element => element["Tracking ID"] == req.query.query)
    data_filter[0]["Checked Status"] = "Checked"
    fs.writeFileSync("./converted.json", JSON.stringify(json))
    log("PUSH FOR : "+req.query.query, "green")
    res.send(data_filter)
})

app.post("/upload", async(req, res)=> {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
      }
      const file = req.files.thecsv
      uploadPath = __dirname + '/csv/' + file.name;
      const checkFile = fs.existsSync("./converted.json")
      fs.writeFileSync("./csv/"+file.name, "Nothing LOL")
      file.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).send(err);
        } else {
            if (checkFile) {
                fs.unlinkSync("./converted.json")
                convertCSV()
            } else {
                convertCSV()
              }
        }
    })
      log("Uploaded : "+file.name, "green")
      await sleep(1000)
      res.status(200).redirect("/")
})

app.get("/tableToExcel.js", (req, res)=> {
    res.sendFile(path.join(__dirname, "/dist/tableToExcel.js"))
})

app.get("/font", (req, res)=> {
    res.sendFile(path.join(__dirname, "/font/Motterdam.ttf"))
})

/*server.listen(port, () => {
    log(`App listening on port ${port}`, "blue")

})*/

export default {
  fetch: httpServerHandler(app),
};

