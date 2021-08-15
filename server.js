const http2 = require('http2')
const fs = require('fs')

const router = require('./router')

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
})

server.on('error', (err) => console.error(err))

server.on('stream', router)

server.on('session', session => {
  console.log('session started')
  session.on('close', () => {
    console.log('session closed')
  })

  session.on('error', err => console.error('session error', err))
})

server.listen(8443)