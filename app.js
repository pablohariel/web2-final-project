const express = require('express');
const app = express();
const body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const user_routes = require('./src/routes/user_routes');
app.use(user_routes);

app.listen(3000);