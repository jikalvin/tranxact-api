const express = require('express');
const { getAllKycRecords, createKycRecord } = require('../controllers/kycController');
const router = express.Router();

router.route('/')
  .get(getAllKycRecords)
  .post(createKycRecord);

// Implement other routes as needed

// Example test cases for createKycRecord
// { userId: '123', documentType: 'Passport', documentNumber: 'ABC123', status: 'Pending', document: <File> } => { userId: '123', documentType: 'Passport', documentNumber: 'ABC123', status: 'Pending', document: 'https://example.com/uploaded_document.pdf' }
// { userId: '456', documentType: 'ID Card', documentNumber: 'DEF456', status: 'Verified', document: <File> } => { userId: '456', documentType: 'ID Card', documentNumber: 'DEF456', status: 'Verified', document: 'https://example.com/uploaded_document.pdf' }

module.exports = router;
