require('module-alias/register');
const path = require('path');
const { AppKeys } = require('./common/const');
// Setup enviroment
const mode = process.env.NODE_ENV;
require('dotenv').config({
   path: mode && mode === AppKeys.ENV_MODE.PROD ?
      path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV}`) : path.resolve(__dirname, '..', `.env`)
});
global.rootDir = __dirname;

const express = require('express');
const databaseConfig = require('./configs/database');
const routeConfig = require('./configs/route.config.js');
const middlewareConfig = require('./configs/middleware.config');

const app = express();

databaseConfig();
middlewareConfig(app);
routeConfig(app);


module.exports = app;