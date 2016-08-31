# Node.js TypeScript Sample

Using Node.js + Express + TypeScript.


## Requirements

* [Node.js](http://nodejs.org/)


## Quick Start

1) Go to the root folder of this project on command line

    $ cd /PROJECT-ROOT

2) Install dependency files

    $ npm install

3) Execute (default browser will open)

    $ npm start


## Test


### Get a Token (Authentication)

1. Run application
2. Point your browser to [http://localhost:3000/test](http://localhost:3000/test) with POST method and put `{"username":"admin","password":"secret"}` in Payload.
3. You will see `token` as a response


### Access to a protected endpoint (Authentication)

1. Run application
2. Make a request to [http://localhost:3000/test](http://localhost:3000/test) with GET method and add a custom header `Authorization` with the token you got from the above step.
3. You can check async/await process in log
