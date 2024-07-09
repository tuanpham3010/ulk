const glob = require('glob');
const { AppConsts } = require('@/common/const');
const path = require('path');
const express = require('express');
const Logger = require('@/libs/common/logger.service');

/**
 * @param {express.Express} app 
 */
function routeConfig(app) {
   const commonRouter = express.Router();

   const routes = glob.sync('../apis/**/*.route.js', { cwd: __dirname });

   // Include all route to router
   for (const routeStr of routes) {
      const pathRoute = path.normalize(routeStr);
      const routeFileName = path.parse(routeStr).base; //Get name of file

      const routeModule = require(pathRoute);
      if (routeModule && Object.getPrototypeOf(routeModule) === express.Router) {
         commonRouter.use(routeModule);
         Logger.log(`Ready route ${routeFileName.split('.')[0]}`);
      }
   }

   app.use(`${AppConsts.API_PREFIX}/${process.env.API_VERSION}`, commonRouter);
}

module.exports = routeConfig;