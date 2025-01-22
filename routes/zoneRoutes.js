const express = require('express');
const { signup,
    signin,
    signout,
    generateReceipt,
    getAllReceipts

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
router.post('/generate-receipt', protect, generateReceipt);
router.get('/all-receipts', protect, getAllReceipts);






module.exports = router;
