const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 8002;
// invoke express and store the result in the variable app
const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    console.log('getting to index');
    response.render('index', { title: 'Epic Number Game' });
});

// const server = app.listen(1337);
const server = app.listen(port, () => console.log(`Express server listening on port ${port}`));    // ES6 way
const io = require('socket.io')(server);

let count = 0;
const resetCount = 0;

io.on('connection', (socket) => {
    console.log('incoming socket connection');

    socket.on('buttonClicked', () => {
        numberUpdated(++count);
    });

    socket.on('resetClicked', (socket) => {
        numberUpdated(resetCount);
        // when reset button is click, also set count var back to 0
        count = 0;
    });

    socket.emit('numberUpdated', count);
});

function numberUpdated(number) {
    io.emit('numberUpdated', number);
};

// catch 404 and forward to error handler
app.use((request, response, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, request, response, next) => {
    // set locals, only providing error in development
    response.locals.message = err.message;
    response.locals.error = request.app.get('env') === 'development' ? err : {};
    response.status(err.status || 500);
    // render the error page
    response.render('error', {title: 'Error page'});
  });

// app.listen(port, () => console.log(`Express server listening on port ${port}`));    // ES6 way