const fs = require('fs');
const express = require("express")
const corsMiddleware = require('./middleware/cors.middleware')

var http = require('http');
var https = require('https');

//const fileUpload = require("express-fileupload")
const testRouter = require("./routes/test.roots")
const usersRouter = require("./routes/user.roots")
const productsRouter = require("./routes/product.roots")
const app = express()



const path=require('path')
app.use(express.static('imgs'))
app.use(corsMiddleware)
//app.use(fileUpload({}))
app.use(express.json(express.json()))
app.use(express.static('imgs'))
app.use("/api/test",testRouter)
app.use("/api/user",usersRouter)
app.use("/api/product",productsRouter)


const host = '127.0.0.1';
const port = 8443;

http
    .createServer(app).listen(port, host, function () {
        console.log(`Server listens https://${host}:${port}`);
    });

const start = async () => {
    try{
        app.listen(port, () => {
            console.log('Server start on Port ',port);
        })
    } catch (e){
        return e
    }
}
start()