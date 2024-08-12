const express = require('express');
const { getAllKycRecords, submitKycStep } = require('../controllers/kycController');
const router = express.Router();

router.route('/')
  .get(getAllKycRecords);

router.route('/submit-step')
  .post(submitKycStep);

module.exports = router;