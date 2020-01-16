## Dependencies
 - MongoDB 4.0+ (on default port)
 - Node 10.15.1

## How to run
 - `npm install` to install dependencies
 - `npm run dev` to run the api in development mode with nodemon
 - `npm run test` to run the tests

## Helpful stuff
 - `docker run --rm -p 127.0.0.1:27017:27017 --name mongo-layup -d mongo:4.0` to run the mongodb 4.0 in a docker container

## Additional Questions
 1. Describe your solution in a few words (expect an experienced programmer reading it) and describe your choice of libraries and/or patterns.
 > Well the API was already defined in the swagger.yaml provided, so the approach I took was a relationship-esq structure within mongodb.
 > Making use of populate to easily grab related data.
 > The idea for boxes & locations to have their own database entries was to provide another starting point if you were to run any aggregation, models would then be assorted logically and aggregation can then be run using indexed fields as opposed to deconstrcucting array fields.
 > Libraries & Reasons:
 > KOAJS: I personally like KoaJS and how light weight and "unopinionated" it is.
 > Lodash: Lodash, no javascript developer should ever develop without it, it's a nice utility library.
 > Chai HTTP: This makes HTTP integration testing much easier, I've never had the need to use another library for this.
 > Mocha: This is just my testing framework of choice, I don't have any technical reasons why I prefer this library, I've just been using it for long and haven't had the need to switch.
 > Mongoose: Because it allows me to define schema's and prevent me from poluting my mongodb collections.

 2. How do you handle transactions?
 > I'm not entirely sure what is meant by "handle" transactions, without the context of a use case.
 > Assuming it's within the mongodb space, all single document operations within mongodb are atomic, making the use of a traditional transaction within this context moot.
 > So if there was a collection that would require transact like opertations, I would structure my models around using single document read/writes.
 > If using atomic single document operations wasn't an option, MongoDB 4.0 released a transaction API.
 > This allows for a more traditional approach with things like start_transaction and commit on multi document read/writes.

 3. What would be your preferred method of hosting the server?
 > If it were this API for this assessment, I would prefer using something like apex up. https://apex.sh/docs/up/, which is a serveless approach.
 > I believe the method of hosting is determined mostly by the application, whether you go serverless or for example use containers is an architectural decision 
 > and in my opinion not up to personal preference.
 > Similarly where you host is also determined by your application e.g. if you're building an application or service around aws tools you would need to host with aws, 
 > if you're building an application / service for a local target market, depending on the latency or bandwidth your application uses, you might opt for a local servivce / hosting provider.

 4. How do you approach logging in Node?
 > Usually I'd use a logging library (something like winston) to add timestamps and log levels to my log outputs.
 > Some process managers like pm2 already write log outputs to files, if nothing is already doing that, I'd write the logs to a file and put these files on a log rotation (winston does this already).
 > For production environments only log critical things like crashes and negate noisy logs like database duplicate indexes.
 > For dev environments log everything.

 5. What is an event loop in Node and how does it interact with asynchronous tasks?
 > The event loop is a process by which node lets the system run certain operations to bypass JavaScript's single threaded nature and perform non-blocking I/O operations.
 > When javascript notices an async call or something needs to happen asynchronously it will hand over control to the event loop.
 > With that being said, I wouldn't say that the event loop interacts with asynchronous tasks, rather it allows tasks to happen asynchronously.

 6. How do you handle errors?
 > try catch throw?
 > I'm not sure what you mean.
 > In certain cases an error that causes a hard crash is necessary to bring attention to the issue.
 > In most cases catching errors and the logging them is the appropriate course of action.
 
 7. How do you prefer to receive configuration?
 > I don't have a preference when it comes to this.
 > Things like CircleCI, PM2 all have their own ways of loading environment variables into your applications runtime.
 > When developing, I like using a barebones approach adding environment variables into my runtime using bash.
 > I've used libaries like dot env before and it really makes no difference to me, as long as the values are in there I'm happy.
