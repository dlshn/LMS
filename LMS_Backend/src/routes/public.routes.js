const express = require('express');
const router = express.Router();
const { getPublicResultByNumber } = require('../controllers/public.controller');

// URL එක වන්නේ: GET /api/public/results/:studentNumber
router.get('/results/:studentNumber', getPublicResultByNumber);

module.exports = router;
