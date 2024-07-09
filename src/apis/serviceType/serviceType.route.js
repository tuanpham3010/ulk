const express = require('express');
const ServiceTypeController = require('./serviceType.controller');

const authRouter = express.Router();

authRouter.get('/serviceType', ServiceTypeController.getAllServiceType);
authRouter.get('/serviceType/id', ServiceTypeController.getServiceTypeId);
authRouter.get('/serviceType/name', ServiceTypeController.getServiceTypeName);
authRouter.post('/serviceType', ServiceTypeController.createServiceType);
authRouter.delete('/serviceType/:id', ServiceTypeController.deleteServiceType);
authRouter.patch('/serviceType/:id', ServiceTypeController.updateServiceType);


module.exports = authRouter;