# Lighthouse Labs | Web Servers 101

[GitHub Repository Branch](https://github.com/WarrenUhrich/lighthouse-labs-web-servers-101/tree/2022.10.25-web-flex-day-19sept2022) | [Vimeo Video Recording](https://vimeo.com/764117456/84340c3809)

* [X] Review: HTTP
* [X] What is a client?
* [X] What is a server?
* [X] Making Requests
* [X] Creating Server-side HTTP Applications in NodeJS (NodeJS' `http` Module)
* [X] Using Express
* [X] Middleware

## Review: HTTP

HTTP stands for Hypertext Transfer Protocol. It is a layer of communication built on top of TCP (Transmission Control Protocol.)

### You may recall that TCP...

* Has a detailed header of remarkable size (20 bytes.)
* Requires a formal and on-going connection (connection-oriented,) confirming and maintaining both sender and recipient of data.
* Corrupted packets are reported to the server; corrections are sent back to the client.
* Packets arrive in-order.

### And that HTTP...

* Is an application-based layer (makes use of TCP standards to ensure error-free delivery of web response data.)
* Features a request-response communication style (a server waits to receive client requests before sending a response.)
* Is stateless; no information is carried into subsequent requests.
* Standard requests must at least have a URL (resource location) and a verb (what the client wants in regards to said resource.)
* Status codes are used to quickly identify what type of response has come from the server.
* Requests and responses have headers containing important information.

## What is a Client?

Clients can refer to any device or application capable of making a request to a server. It is not uncommon for people to assume web browsers are the only application capable of matching this description, but it is important to note that this is far from the truth! There are a wide array of ways that one can interact with servers, and servers can... well... **serve** many purposes.

Consider [cURL](https://en.wikipedia.org/wiki/CURL), a popular command-line tool for making requests to servers of many types (not limited to just HTTP.) Your terminal may already have this installed, you can try it out! This is a great example of a non-web browser client that is perfectly valid and commonly used. Especially in the Linux world, much of the software you download via the command-line ends up making use of this very program to get those applications from web servers to your computer for installation.

```bash
curl https://duckduckgo.com/ # Load an HTML string from this web page into your terminal.
```

```bash
curl https://cat-fact.herokuapp.com/facts # Load a JSON string from this URL into your terminal.
```

Developers, whether testing third-party APIs or writing their own, often use one of various API platform softwares to easily format requests and read responses. The most popular among these is [Postman](https://www.postman.com/).

Another very common use is in applications. Now, this might sound a bit confusing, but bear with me! Many web servers host applications that make requests to *other* web servers... That makes the former (or, at least its hosted application) a client! But think about it, many desktop, mobile, and server applications need information from other servers and their applications. Applications and servers reach out to others all the time for information! Much of the request traffic out there is actually server-to-server; though if it is HTTP traffic, the one making the request would always be considered the **client**. Consider the following [JavaScript (NodeJS) program](https://nodejs.dev/learn/making-http-requests-with-nodejs):

```JavaScript
const https = require('https');
const options = {
  hostname: 'duckduckgo.com',
  path: '/',
  port: 80,
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
```

Notice how we receive the HTML contents of the response from the host based on the path we provided. Try another, this time we'll be hoping for a JSON response:

```JavaScript
const https = require('https');
const options = {
  hostname: 'https://cat-fact.herokuapp.com',
  path: '/facts',
  port: 80,
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
```

## What is a Server?

Any device that is capable of accepting, interpreting, and responding to a(n HTTP) request would be considered a web server. As far as we're concerned as web developers, we often see this presented as any one of the following:

* **Web Server**: any software that accepts HTTP/HTTPS requests and can return a representation of that resource (or an error.) Examples) [Apache](https://httpd.apache.org/), [nginx](https://nginx.org/en/), [IIS](https://www.iis.net/).
* **Application Server**: a server that hosts applications. Examples) [Jakarta EE](https://jakarta.ee/), [Zend Server](https://www.zend.com/downloads/zend-server).
* **Load Balancer**: server that diverts request traffic (hopefully equally) among a variety of appropriate response servers, to avoid any getting overloaded. Example) [HAProxy](https://www.haproxy.org/).

Of course, we end up making requests to servers in our everyday life. Whether we're checking the weather, or the next assignment on Compass, we're using a client (our web browser) to submit an HTTP request to a web server and hoping for a response.

In practice, servers are typically computers, not too unlike the one you're likely using right now. The primary difference is that many server computers are stripped down of niceties like graphical user interfaces to free up resources to their applications and software dedicated to responding to their HTTP requests. A very common and open source example is the LAMP stack:

1. [Linux](https://en.wikipedia.org/wiki/Linux) ([CentOS](https://www.centos.org/), [Ubuntu](https://ubuntu.com/))
2. [Apache](https://httpd.apache.org/)
3. [MariaDB](https://mariadb.org/)
4. [PHP](https://www.php.net/) (or [Perl](https://www.perl.org/))

Following those numbers, we can see what makes up most real web applications piece-by-piece:

1. Operating System
2. Web Server Software
3. Database Management System
4. Interpretor or Executable

This same breakdown is applicable for most of what we see online as websites or web applications, though some can be even simpler. If the site is purely informational, and has no logic or massive set of information to filter through, it may be as simple as **1.** and **2.**, with no need for the rest. The operating system can open web ports, and the web server software, in such a case, can just serve HTML, CSS, JS, image, video, audio, and any other files directly as needed. As you work through this program, your local computer may be capable of similar stacks, for example:

1. Ubuntu
2. Apache
3. PostgreSQL
4. Node.js

Locally these tools could be used for testing, or if you're ambitious (and hopefully careful) it is possible to serve responses *from* your home machine. This is not recommended for security reasons, however. It is best to offload real web traffic to a more reliable third-party solution (and not to allow your IP to be public, as bots and hackers may attempt to attack your machine if they catch wind of it.)

A basic implementation of a Node.js application server would be:

```JavaScript
const http = require('http'); // Require the http module.

const port = 8080; // Easily modifiable port number variable.

// Create a server; use a function to accept the request and send a response.
const server = http.createServer((req, res) => { // Callback accepts the request data, and a response handler as parameters.
  console.log(Date(), 'Request received:', '\n', req.method, req.url);

  // We can use the response handler to add information to, and write to, our response to the client.
  res.writeHead( // Use the .writeHead() method to populate the status and any necessary header data.
    200, // Set a status code for your response (200 is the OK status!)
    {'Content-Type': 'text/html'} // The rest is an object with header names and values.
  );
  // The .write() method is used for populating the body of your response (often a web page or JSON data.)
  res.write('<!DOCTYPE html><html><head><title>Hello, World!</title></head><body><h1>Hello, World!</h1></body></html>');
  res.end(); // Close the response (let Node.js know we're done with it!)
})

// The server object has a .listen() method we can use to wait for requests.
server.listen(port, () => { // We can specify which port we should listen on for requests.
  console.log('HTTP server listening on port:', port);
});
```

If you populate a `.js` file with the above and run it, see if you can access [http://localhost:8080](http://localhost:8080) in your web browser, via cURL, via Postman, or any other HTTP client. Note that you must follow `localhost` with the port you have defined (if it is not the default `:80`.)

Try visiting [http://localhost:8080/test123](http://localhost:8080/test123), what do you see?

Right now all requests are met with the same response: our "Hello, World!" example output. In most real applications, you'll want your responses to vary based on which resource, or route, is included in the URL. The process of identifying which resource belongs in the response based on the requested path is referred to as **routing**.

## Routes

The idea of routing in a web application is to add a way of providing different responses for different paths being requested by a client. For instance, many websites have a "homepage" (`example.com/home`), an "about" page (`example.com/about`), and perhaps a "contact" page (`example.com/contact`.) A user would expect the output from each of these unique paths to provide a unique resource with unique purpose and content.

How might we add basic routing to a NodeJS `http` server? Let's find out:

```JavaScript
const http = require('http');

const port = 3000;

// Homepage.
const getHome = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<!DOCTYPE html>
    <html>
      <head>
        <title>Home</title>
      </head>
      <body>
        <h1>Home</h1>
        <p>
          Welcome to the home page!
        </p>
      </body>
    </html>
  `);
};

// About page.
const getAbout = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<!DOCTYPE html>
    <html>
      <head>
        <title>About</title>
      </head>
      <body>
        <h1>About</h1>
        <p>
          Welcome to the about page!
        </p>
        <p>
          This is an HTTP application server built using Node.js; developed for practice.
        </p>
      </body>
    </html>
  `);
};


// 404 page (resource not found.)
const get404 = (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end(`<!DOCTYPE html>
    <html>
      <head>
        <title>404: Resource Not Found</title>
      </head>
      <body>
        <h1>404: Resource Not Found</h1>
        <p>
          Sorry, we couldn't find anything at:
          ${req.url}
        </p>
        <p>
          <a href="/">Click here to return home.</a>
        </p>
      </body>
    </html>
  `);
};

const server = http.createServer((req, res) => {
  console.log(Date(), 'Request received:', '\n', req.method, req.url);

  const route = `${req.method} ${req.url}`; // Route string.

  // Handle various routes (if/elseif/else or switch.)
  switch(route) {
    case 'GET /':
    case 'GET /home':
      getHome(req, res);
      break;
    case 'GET /about':
      getAbout(req, res);
      break;
    default:
      get404(req, res);
      break;
  }
});

server.listen(port, () => {
  console.log('HTTP server listening on port:', port);
});
```

Run the above in NodeJS and try the following links via a valid client:

* [http://localhost:3000/](http://localhost:3000/)
* [http://localhost:3000/home](http://localhost:3000/home)
* [http://localhost:3000/about](http://localhost:3000/about)
* [http://localhost:3000/test123](http://localhost:3000/test123)

Wow, now we have a whole little website working; congratulations, your first dynamic website and first server-side app with routing!

## Express

When working on applications for the web, it often helps to make use of frameworks to save you time and ensure your code will execute in a more safe and repeatable manner. In the NodeJS world, [Express](https://expressjs.com) is one of, if not *the*, leading framework for serving web pages or API JSON responses. *Note that there are other popular frameworks like [Koa](https://koajs.com/), [Meteor](https://www.meteor.com/), [Sails](https://sailsjs.com/), and [hapi](https://hapi.dev/)*.

### [Getting Started](https://expressjs.com/en/starter/) with Express

Inside of your project folder, run:

```bash
npm install express
```

Once installed, we can start writing an Express application.

### Using Express

Let's convert our previous application into an Express app:

```JavaScript
const express = require('express');

const app = express();
const port = 5000;

const getHome = (req, res) => {
  res.status(200);
  res.contentType('text/html');
  res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>Home</title>
      </head>
      <body>
        <h1>Home</h1>
        <p>
          Welcome to the home page!
        </p>
      </body>
    </html>
  `);
  res.send();
};

app.get('/', getHome);
app.get('/home', getHome);

app.get('/about', (req, res) => {
  res.status(200);
  res.contentType('text/html');
  res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>About</title>
      </head>
      <body>
        <h1>About</h1>
        <p>
          Welcome to the about page!
        </p>
        <p>
          This is an HTTP application server built using Node.js; developed for practice.
        </p>
      </body>
    </html>
  `);
  res.send();
});

app.use((req, res) => {
  res.status(404);
  res.contentType('text/html');
  res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>404: Resource Not Found</title>
      </head>
      <body>
        <h1>404: Resource Not Found</h1>
        <p>
          Sorry, we couldn't find anything at:
          ${req.url}
        </p>
        <p>
          <a href="/">Click here to return home.</a>
        </p>
      </body>
    </html>
  `);
  res.send();
});

app.listen(port, () => {
  console.log('HTTP server listening on port:', port);
});
```

There we have it! A clean conversion from the default `http` module to an Express app.

## Another Example; Query Parameters

Alright, so we've been able to serve some pretty static content thus far. How about *dynamic* content? That is to say, content we can't just throw in a string because something about the resource can be modified. We see this all the time on websites we visit every day... maybe we're searching for something on Google `google.com/q=node.js`, or we want to watch a specific YouTube video `youtube.com?v=dQw4w9WgXcQ`. For these cases, we want to capture a **query parameter** and modify our response accordingly.

For us to ask for specific resources, we'll need... specific resources! Let's add a JSON file to our project:

***disney-movies.json***

```JavaScript
[
  {"name": "Spider-Man: No Way Home", "year": "2021", "imdbRating": "8.4", "image": "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg"},
  {"name": "Soul",                    "year": "2020", "imdbRating": "8.0", "image": "https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg"},
  {"name": "Brave",                   "year": "2012", "imdbRating": "7.1", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Brave_Poster.jpg/220px-Brave_Poster.jpg"},
  {"name": "The Incredibles",         "year": "2004", "imdbRating": "8.0", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/The_Incredibles_%282004_animated_feature_film%29.jpg/220px-The_Incredibles_%282004_animated_feature_film%29.jpg"},
  {"name": "Finding Nemo",            "year": "2003", "imdbRating": "8.2", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Finding_Nemo.jpg/220px-Finding_Nemo.jpg"},
  {"name": "Lilo & Stitch",           "year": "2002", "imdbRating": "7.3", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/LiloandStitchmovieposter.jpg/220px-LiloandStitchmovieposter.jpg"},
  {"name": "Monsters, Inc.",          "year": "2001", "imdbRating": "8.1", "image": "https://upload.wikimedia.org/wikipedia/en/6/63/Monsters_Inc.JPG"},
  {"name": "A Bug's Life",            "year": "1998", "imdbRating": "7.2", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/A_Bug%27s_Life.jpg/220px-A_Bug%27s_Life.jpg"},
  {"name": "Toy Story",               "year": "1995", "imdbRating": "8.3", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Toy_Story.jpg/220px-Toy_Story.jpg"},
  {"name": "Beauty and the Beast",    "year": "1991", "imdbRating": "8.0", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Beauty_and_the_Beast_%281991_film%29_poster.jpg/220px-Beauty_and_the_Beast_%281991_film%29_poster.jpg"},
  {"name": "TRON",                    "year": "1982", "imdbRating": "6.7", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Tron_poster.jpg/220px-Tron_poster.jpg"},
  {"name": "Robin Hood",              "year": "1973", "imdbRating": "7.5", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Robinhood_1973_poster.png/220px-Robinhood_1973_poster.png"},
  {"name": "Sleeping Beauty",         "year": "1959", "imdbRating": "7.2", "image": "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Sleeping_beauty_disney.jpg/220px-Sleeping_beauty_disney.jpg"}
]
```

This will act as our set of data. It is a basic JavaScript array filled with objects. Our goal will be to develop a basic application that is capable of rendering information about a specific movie in this set based on a part of the path. We'd like our app, for example, to show information about "The Incredibles" should we enter `localhost:7000/disney-movies/3` into our web browser's address bar (or any other valid client.)

Let's try the following!

```JavaScript
const disneyMovies = require('./disney-movies.json');
const express = require('express');

const app = express();
const port = 7000;

const notFound404 = (req, res) => {
  res.status(404);
  res.contentType('text/html');
  res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>404: Resource Not Found</title>
      </head>
      <body>
        <h1>404: Resource Not Found</h1>
        <p>
          Sorry, we couldn't find anything at:
          ${req.url}
        </p>
      </body>
    </html>
  `);
  res.send();
};

app.get('/disney-movies/:disney_movie_id', (req, res) => {
  const disneyMovieId = parseInt(req.params.disney_movie_id);

  if(typeof disneyMovies[disneyMovieId] !== 'undefined') {
    const disneyMovie = disneyMovies[disneyMovieId];

    res.status(200);
    /**
     * Try a JSON response:
     *
     * res.contentType('text/json');
     * res.json(disneyMovie);
     *
     * Then try a real, valid, web page:
     */
    res.contentType('text/html');
    res.write(`<!DOCTYPE html>
      <html>
        <head>
          <title>Disney Movie: ${disneyMovie.name}</title>
        </head>
        <body>
          <h1>Disney Movie: ${disneyMovie.name}</h1>
          <p>
            <img src="${disneyMovie.image}">
            <strong>${disneyMovie.name}</strong>
            (${disneyMovie.year})
            [Rating: ${disneyMovie.imdbRating} ★]
          </p>
        </body>
      </html>
    `);
    res.send();
  } else {
    notFound404(req, res);
  }
});

app.use(notFound404); // Default.

app.listen(port, () => {
  console.log('HTTP server listening on port:', port);
});
```

There we have it, a web page that shows us information about a movie - and we have the ability to specify which movie it is we want to check out via the URL. Very cool! However, imagine we had a few more pages, this file starts to get very long, and has a lot of responsibilities. It was nice that we had the data split into a separate JSON file, can we do the same for our HTML string(s)?

Absolutely. In most sizeable full-stack web applications, an idea called MVC begins to come into play. We'll spend a lot of time with this concept down the road, but the very basics break down into:

* **M**odel: A representation of the data for the application, this often communicates with the database.
* **V**iew: The visual aspect; often HTML, CSS, and JavaScript that the end-user can interact with.
* **C**ontroller: The brain of the application, contains the logic and bridges the model (data) and visuals (views.)

Again, we're not getting deep into the concept just yet, but we're scratching the surface of that iceberg. Keep the term in mind for a later day! Know that the goal in organizing your software is to make it more secure, have a separation of concerns, and increase legibility by ensuring files, functions, and classes have specific jobs and avoid becoming overwhelming.

## Views

With the above in mind, views will be separated into files that will define the output for our app. Many application frameworks, Express included, are compatible with a [variety of templating engines](https://expressjs.com/en/resources/template-engines.html). These allow us to more easily format our output and give us easy ways to embed data and even simple logic into our output (view) files. The most successful, trusted, and popular among these in the JavaScript world is [Embedded JavaScript (EJS)](https://ejs.co/).

We'll add a homepage to our "Disney Movies" application that makes use of the EJS templating engine, then update the rest of the application to use it as well.

Firstly, we'll need the templating engine available in our project folder:

```bash
npm install ejs
```

Once that's ready, we'll ensure it is set up in our application as well:

***disney-movies.js***

```JavaScript
const express = require('express');

const app = express();
const port = 7000;

// We'll notify Express that we plan on using the EJS templating language; ensure it is installed.
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home'); // Will look for a template file in: /views/home.ejs
});

app.listen(port, () => {
  console.log('HTTP server listening on port:', port);
});
```

The above will be upset when we try to visit the homepage as we have no view file just yet! Create a folder called `views` in the project, and we'll add a `home.ejs` file there:

***views/home.ejs***

```ejs
<!DOCTYPE html>
<html>
  <head>
    <title>Homepage</title>
  </head>
  <body>
    <h1>Homepage</h1>
    <p>
      Welcome to the homepage!
    </p>
  </body>
</html>
```

Now, we should be good to visit [http://localhost:7000/](http://localhost:7000/) and receive a response containing the HTML that we wrote. Epic!

### Converting the Rest of our Application

Alright, let's move on to the rest of our file; we'll now use views for the 404 and "Disney Movies" portions of our app.

***views/about.ejs***

```ejs
<!DOCTYPE html>
<html>
    <head>
        <title>About</title>
    </head>
    <body>
        <h1>About</h1>
        <p>
            Welcome to the about page!
        </p>
        <p>
            This is an HTTP application server built using Node.js; developed for practice.
        </p>
    </body>
</html>
```

***views/disney-movies.ejs***

```ejs
<!DOCTYPE html>
<html>
    <head>
        <title>Disney Movie: <%= name %></title>
    </head>
    <body>
        <h1>Disney Movie: <%= name %></h1>
        <p>
            <img src="<%= image %>">
            <strong><%= name %></strong>
            (<%= year %>)
            [Rating: <%= imdbRating %> ★]
        </p>
    </body>
</html>
```

***disney-movies.js***

```JavaScript
const express = require('express');

const app = express();
const port = 7000;

// We'll notify Express that we plan on using the EJS templating language; ensure it is installed.
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home'); // Will look for a template file in: /views/home.ejs
});

app.get('/about', (req, res) => {
  res.render('about'); // Will look for a template file in: /views/about.ejs
});

app.get('/disney-movies/:disney_movie_id', (req, res) => {
  const disneyMovieId = parseInt(req.params.disney_movie_id);

  if(typeof disneyMovies[disneyMovieId] !== 'undefined') {
    const disneyMovie = disneyMovies[disneyMovieId];
    // Pass in an object, and its properties can be used throughout the template file!
    res.render('disney-movies', disneyMovie);
  }
});

app.listen(port, () => {
  console.log('HTTP server listening on port:', port);
});
```

## Resources

* [Making HTTP requests with Node.js](https://nodejs.dev/learn/making-http-requests-with-nodejs/)
* [How do I create a HTTP server?](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/)
* [Installing Express](https://expressjs.com/en/starter/installing.html)
* [Express "Hello World" example](https://expressjs.com/en/starter/hello-world.html)
* [Using Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
* [[Express] Template Engines](https://expressjs.com/en/resources/template-engines.html)
* [EJS -- Embedded JavaScript](https://ejs.co/)
