const express = require('express');
const multer = require('multer');
const { getAllKycRecords, submitKycStep } = require('../controllers/kycController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.route('/')
  .get(getAllKycRecords);

router.post('/submit-step', upload.any(), submitKycStep);

module.exports = router;