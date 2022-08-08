const https = require('https');

const options = {
    hostname: 'cat-fact.herokuapp.com',
    path: '/facts',
    port: 443, // http is :80; https is :443
    method: 'GET', // GET or POST
};

const request = https.request(options, (response) => {
    response.on('data', (data) => {
        // console.log(data); // Will print the data as raw binary.
        // process.stdout.write(data); // Will print the data in a readable string.
        const dataArray = JSON.parse(data); // Convert the JSON string into an actual JS array / object.
        // console.log(dataArray);

        if (dataArray) {
            for (const catFactObj of dataArray) {
                console.log('*', catFactObj.text);
            }
        }
    });
});

request.on('error', (error) => {
    console.error(error);
});

request.end();