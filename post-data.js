const http2 = require('http2')
const fs = require('fs')
const session = http2.connect('http://localhost:8443')
session.on('error', (err) => console.error(err))

// Here, req is a new request stream
const req = session.request({
    ':path': '/send-data',
    ':method': 'POST'
})
// consider an object with some sample data
const sampleData = { somekey: "somevalue" }
// we can convert this into a string and call
// the req.write method
// the second argument specifies the encoding, which is utf8 for now
req.write(JSON.stringify(sampleData), 'utf8')
req.end()

// This callback is fired once we receive a response
// from the server
req.setEncoding('utf8')
req.on('response', (headers) => {
    // we can log each response header here
    for (const name in headers) {
        console.log(`${name}: ${headers[name]}`)
    }
})

// To fetch the response body, we set the encoding
// we want and initialize an empty data string
let data = ''

// append response data to the data string every time
// we receive new data chunks in the response
req.on('data', (chunk) => { data += chunk })

// Once the response is finished, log the entire data
// that we received
req.on('end', () => {
    console.log(`\n${data}`)
    // In this case, we don't want to make any more
    // requests, so we can close the session
    session.close()
})