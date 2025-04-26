### Fuzz
Wraps a [node-amqp](https://github.com/postwait/node-amqp) connection object and exposes some useful helpers and properties.

#### Installation
    npm install fuzz

#### Usage
	var config = {
      rabbitMQ: {
	    host: 'localhost',
	    port: 5672,
	    login: 'guest',
	    password: 'guest',
	    vhost: '/'
	  }
	};
	var fuzz = new fuzz(config);
    fuzz.connect(callback); // Connect to RabbitMQ and execute callback when ready event fired

#### Properties
    fuzz.connected; // Boolean value tracking the status of the RabbitMQ connection

Documentation site at http://thedeveloper.github.com/fuzz/

Source documentation available at http://thedeveloper.github.com/fuzz/doc/README.md.html

#### Why fuzz?
Rabbits are fuzzy.

#### License

(The MIT license)

Copyright (c) Geoff Wagstaff

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
