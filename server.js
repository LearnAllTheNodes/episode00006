var express = require("express")
  , app     = express()
  , port    = process.env['PORT'] || 3000

// Route handlers
function home(req,res) {
  res.setHeader("Content-Type", 'text/html')
  res.send('<html><head><title>NodeSlash</title></head><body><h1>Web\'s Premiere Browser Game</h1><p><form action="/login" method="POST"><label for="username">Username</label><input id="username" type="text" name="username"><button type="submit">Start ye adventures!</button></form></p><p><img src="/images/sword_and_shield.png"></p><a href="/adventures">Go to adventures</a></body></html>')
}

function adventuresIndex(req,res) {
  res.setHeader("Content-Type", 'text/html')
  res.send("<html><head><title>Adventures - NodeSlash</title></head><body><h1>Are ye bravez, " + req.session.username + "?</h1><form action='/adventures' method='POST'><button type='submit'>Yes I am bravez</button></form></body></html>")
}

function createAdventure(req,res) {
  res.setHeader("Content-Type", 'text/html')
  res.send('<html><head><title>Adventures - NodeSlash</title></head><body><h1>Thou hast bravez.</h1><form action="/adventures/42" method="POST"><input type="hidden" name="_method" value="put"><button type="submit">Cheat!</button></form><form action="adventures" method="POST"><button type="submit">Again!</button></form><p>You have found some <a href="/loot/1">loot.</a></p></body></html>')
}

function updateAdventure(req,res) {
  res.setHeader("Content-Type", 'text/html')
  res.send("<html><head><title>Adventures - NodeSlash</title></head><body><h1>It's a secret to everybody.</h1></body></html>")
}

function showLoot(req,res) {
  var id = req.params.id

  res.setHeader("Content-Type", 'text/html')
  res.send("<html><head><title>Adventures - NodeSlash</title></head><body><h1>Ogre-slaying knife</h1><p>It has +9 against ogres. It was id #" + id + "</p></body></html>")
}

function login(req,res) {
  if (req.body.username) {
    req.session.username = req.body.username
    res.redirect("/adventures")
  } else {
    res.redirect("/")
  }
}

// Middlwarez
function stoopidLogger(options) {
  return function stoopidLoggerInner(req,res,next) {
    console.log("Hi! I was called at: ", req.path)
    next()
  }
}

function ensureAuthenticated(req,res,next) {
  if (req.session.username) {
    next()
  } else {
    res.redirect("/")
  }
}

function notFound(req,res) {
  res.setHeader("Content-Type", 'text/html')
  res.send(404, "Confound it all!  We could not find ye's page! ")
}

function catchErrors(err,req,res,next) {
  console.log("There was an error! In the real world, I might be alerting the engineering team.")
  next(err)
}

function showErrorPage(err,req,res,next) {
  res.setHeader("Content-Type", 'text/html')
  res.send(500, "Confound it all! It's a 500 error!")
}

function readFromDB(req,res,next) {
  next(new Error("We don't need no stinkin' DB!"))
}

app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.cookieParser())
app.use(express.cookieSession({secret: "it'sasecrettoeverybody", key: "session"}))
app.use("/", stoopidLogger())
app.use(express.static(__dirname + '/public'))
app.use(app.router)
app.use(notFound)
app.use(catchErrors)
app.use(showErrorPage)

// Routes
app.get("/",               home)
app.get("/read_from_db",   readFromDB)
app.post("/login",         login)
app.all("/*",              ensureAuthenticated)
app.get("/adventures",     adventuresIndex)
app.post("/adventures",    createAdventure)
app.put("/adventures/:id", updateAdventure)
app.get("/loot/:id",       showLoot)

app.listen(port)

console.log('Server running at http://127.0.0.1:' + port + '/')
