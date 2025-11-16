const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sweetController');

router.get('/stats', ctrl.dashboardStats);

module.exports = router;
