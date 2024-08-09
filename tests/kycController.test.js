const KYC = require('../models/kycModel');
const { createKycRecord } = require('../controllers/kycController');
const { uploadDocument } = require('../services/fileUploadService');

jest.mock('../services/fileUploadService');

describe('KYC Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKycRecord', () => {
    it('should create a Level 1 KYC record', async () => {
      const mockUploadedDocument = { url: 'https://example.com/document.pdf' };
      uploadDocument.mockResolvedValueOnce(mockUploadedDocument);

      const req = {
        body: {
          userId: '123',
          documentType: 'Passport',
          documentNumber: 'ABC123',
          level: 'Level 1',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createKycRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        userId: '123',
        documentType: 'Passport',
        documentNumber: 'ABC123',
        level: 'Level 1',
        status: 'Pending',
        document: mockUploadedDocument.url,
      }));
    });

    it('should handle errors', async () => {
      const errorMessage = 'Error uploading document';
      uploadDocument.mockRejectedValueOnce(new Error(errorMessage));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createKycRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
