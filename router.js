// this is our original handler, extracted as a function
const helloWorldHandler = (stream, headers) => {
    console.log({ headers })
    stream.respond({
        ':status': 200
    })
    stream.end('Hello World')
}

// the pingHandler returns "pong" to let us know that
// the server is up and running
const pingHandler = (stream, headers) => {
    if (stream.closed) {
        return
    }
    console.log({ headers })
    stream.respond({
        ':status': 200
    })
    stream.end('pong')
}

// in case a route doesn't exist, we want to return a
// 404 status and a message that the path is not found
const notFoundHandler = (stream, headers) => {
    stream.respond({
        'content-type': 'text/plain; charset=utf-8',
        ':status': 200
    })
    stream.end('path not found')
}

// the router is itself a special type of handler
// where we send the original request to another
// handler based on the pseudo headers
const router = (stream, headers) => {

    stream.on('close', () => console.log('stream closed'))
    stream.on('error', (err) => console.log('stream error', err))


    // first, extract the path and method pseudo headers
    const path = headers[':path']
    const method = headers[':method']

    // we can use a simple if-else ladder to determine the
    // final destination for the request stream and assign
    // it to the `handler` variable
    let handler
    if (path === "/hello-world" && method === 'GET') {
        handler = helloWorldHandler
    }
    else if (path === "/ping" && method == 'GET') {
        handler = pingHandler
    }
    else {
        handler = notFoundHandler
    }

    // finally, apply the chosen handler to the request
    handler(stream, headers)

}

module.exports = router