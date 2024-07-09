const express = require('express');
const { asyncHandle } = require('@/utils/auth.utils');
const CashOutController = require('./cashOut.controller');

const router = express.Router();

router.get('/cash-out/admin', asyncHandle(CashOutController.getRequests)); //admin
router.get('/cash-out/user', asyncHandle(CashOutController.getUserRequests)); //user
router.get(
	'/cash-out/id/:requestId',
	asyncHandle(CashOutController.getARequest) //admin
);
router.post(
	'/cash-out/complete/:requestId',
	asyncHandle(CashOutController.completeRequest) //admin
);
router.post('/cash-out', asyncHandle(CashOutController.createRequest)); //user
router.patch(
	'/cash-out/user/cancel/:requestId',
	asyncHandle(CashOutController.cancelRequestByUser)
); //user

// router.delete(
// 	'/cash-out/:requestId',
// 	asyncHandle(CashOutController.deleteRequest)
// );
// router.patch(
// 	'/cash-out/:requestId',
// 	asyncHandle(CashOutController.updateRequest)
// );

module.exports = router;
