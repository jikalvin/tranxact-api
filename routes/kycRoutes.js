const express = require('express');
const { getAllKycRecords, createKycRecord } = require('../controllers/kycController');
const router = express.Router();

router.route('/')
  .get(getAllKycRecords)
  .post(createKycRecord);

// Implement other routes as needed

module.exports = router;
