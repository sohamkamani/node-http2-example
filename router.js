
const helloWorldHandler = (stream, headers) => {
    console.log({ headers })
    // stream is a Duplex
    stream.respond({
        'content-type': 'text/html; charset=utf-8',
        ':status': 200
    })
    stream.end('<h1>Hello World</h1>')
}

const pingHandler = (stream, headers) => {
    console.log({ headers })
    // stream is a Duplex
    stream.respond({
        'content-type': 'text/plain; charset=utf-8',
        ':status': 200
    })
    stream.end('pong')
}

const notFoundHandler = (stream, headers) => {
    stream.respond({
        'content-type': 'text/plain; charset=utf-8',
        ':status': 200
    })
    stream.end('path not found')
}

const router = (stream, headers) => {
    console.log('routing...', headers)
    const path = headers[':path']
    const method = headers[':method']

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

    handler(stream, headers)
}

module.exports = router