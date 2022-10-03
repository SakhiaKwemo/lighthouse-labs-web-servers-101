const express = require('express');

///////////////////////////////////////////////////////////////////////////////////
// Configuration
///////////////////////////////////////////////////////////////////////////////////

const PORT = 4444;
const app = express();

///////////////////////////////////////////////////////////////////////////////////
// Middleware
///////////////////////////////////////////////////////////////////////////////////

// Logging Middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

///////////////////////////////////////////////////////////////////////////////////
// Listener
///////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log('Express app running on port:', PORT);
});

///////////////////////////////////////////////////////////////////////////////////
// Routes
///////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.status(200);
    res.contentType('text/html');
    res.end('<html><head><title>Homepage</title></head><body><h1>Homepage</h1></body></html>');
});

app.get(['/home', '/index', '/homepage', '/default', '/landing'], (req, res) => {
    res.status(301);
    res.redirect('/');
});

app.get('/about', (req, res) => {
    res.status(200);
    res.contentType('text/html');
    res.end('<html><head><title>About Page</title></head><body><h1>About Page</h1></body></html>');
});

// Asterisk is wildcard - anything that doesn't match the above
app.get('*', (req, res) => {
    res.status(404);
    res.contentType('text/html');
    res.end('<html><head><title>404: Page Not Found</title></head><body><h1>404: Page Not Found</h1></body></html>');
});;