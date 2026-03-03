const express = require('express');

const route = express.Router();

route.use('/auth', require('./auth/auth.route'));


route.use('/admin', require('./auth/admin/admin.route'));

module.exports = route;