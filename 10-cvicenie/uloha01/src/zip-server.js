const path = require('path')
const http = require('http')
const fs = require('fs')
const { pipeline } =require('stream')
const { createGzip} = require('zlib')

const storageDir = path.join(__dirname, 'vystup')

const server = http.createServer()
server.listen(8888, "localhost")
  .on("request", (req, res) => {
    const storageFile = path.join(storageDir, `${new Date().getTime()}-${req.headers['file-name']}` )
    pipeline(
        req,
        fs.createWriteStream(storageFile),
        (err) => {
            if(err) {
                console.error(err)
                res.statusCode = 500;
                res.statusMessage = 'Internal Server Error'
                res.end()
                process.exit(1)
            }
            else{
                pipeline(
                    req,
                    createGzip(),
                    res,
                    err => {
                        if(err){
                            console.error({ message: 'Error occured, terminating!', error: err})
                            res.statusCode = 500;
                            res.statusMessage = 'Internal Server Error'
                            res.end()
                            process.exit(1)
                        }
                        else{
                            console.log('Job finished!')
                        }
                    }
                )
            }
        }
    )
  });