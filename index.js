const express = require("express");
const session = require("express-session");
const filestore = require("session-file-store")(session);
const flash = require("express-flash");
const {engine} = require("express-handlebars")
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const conn = require("./db/conn");

//models
const Tought = require("./models/Tought")
const User = require("./models/User")
app.engine('handlebars', engine());
app.set("view engine","handlebars");


const toughtsRoutes = require("./routes/tougths.routes")
const authRoutes = require("./routes/auth.routes")

const ToughtController = require("./controllers/Toughtscontroller")
app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use(
    session({
        name:"session",
        secret:"nosso_secret",
        resave:false,
        saveUninitialized:false,
        store:new filestore({
            logFn:function(){},
            path:require("path").join(require("os").tmpdir(),"sessions"),

        }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires:new Date(Date.now()+360000),
            httpOnly:true
        }

    })
)

//flash messages
app.use(flash())

//set session to res

//public path
app.use(express.static("public"))
app.use(
    (req,res,next)=>{
        if(req.session){
            res.locals.session=req.session;
        }

        next();
    }
)

app.use("/toughts",toughtsRoutes);
app.use("/",authRoutes);
app.use("/",ToughtController.showAll);


conn.sync().then(()=> app.listen(3000)).catch(err => console.log(err))