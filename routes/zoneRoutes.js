const express = require('express');
const {
    signin,
    signout,
    generateReceipt,
    getAllReceipts,
    deleteReceipt,
    getReceiptById,

} = require('../controllers/zoneController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

///////////////AUTH////////////////////////
router.post('/signin', signin);
router.post('/signout', protect, signout);
router.get('/profile', protect, (req, res) => {
    res.json(req.zone);
});

///////////////RECEIPT////////////////////////
router.get('/all-receipts', protect, getAllReceipts);
router.get('/receipt/:id', getReceiptById);
router.post('/generate-receipt', protect, generateReceipt);
router.delete('/delete-receipt/:id', protect, deleteReceipt);






module.exports = router;
