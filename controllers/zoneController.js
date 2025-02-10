const Zone = require('../models/Zone');
const Receipt = require('../models/Receipt');
const multer = require('multer');
const path = require('path');

const { generateToken } = require('../utils/token');

// Zone Signin
const signin = async (req, res) => {
    const { zoneId, password } = req.body;
    try {
        const zone = await Zone.findOne({ zoneId });
        if (zone && (await zone.matchPassword(password))) {
            res.status(200).json({
                id: zone._id,
                name: zone.name,
                email: zone.email,
                phone: zone.phone,
                type: zone.type,
                zonename: zone.zonename,
                note: zone.note,
                zoneId: zone.zoneId,
                token: generateToken(zone._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid ZoneId or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Zone Signout
const signout = (req, res) => {
    res.status(200).json({ message: 'Signed out successfully' });
};



// Zone Add Product
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    },
});

// Add product API with image uploader
const addZone = async (req, res) => {
    const { name, email, phone, type, zonename, note, zoneId, password } = req.body;
    try {
        if (await Zone.findOne({ zonename })) {
            return res.status(400).json({ message: 'This zone is already exists' });
        }

        const zone = await Zone.create({
            name, email, phone, type, zonename, note, zoneId, password,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });

        res.status(201).json({
            id: zone._id,
            name: zone.name,
            email: zone.email,
            phone: zone.phone,
            type: zone.type,
            zonename: zone.zonename,
            note: zone.note,
            zoneId: zone.zoneId,
            password: zone.password,
            usertype: "zone",
            image: zone.image,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllZones = async (req, res) => {
    try {
        const zones = await Zone.find(); // Get all zones from the database
        res.status(200).json(zones); // Return the list of zones in the response
    } catch (err) {
        console.error('Error fetching zones:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteZone = async (req, res) => {
    const { id } = req.params; // Get zone ID from the route parameters
    try {
        const zone = await Zone.findByIdAndDelete(id); // Find and delete the zone
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }
        res.status(200).json({ message: 'Zone deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const generateReceipt = async (req, res) => {

    const zoneId = req.zone._id; // Authenticated zone's ID
    const { name, phone, amount, payment, paymenttype } = req.body;

    try {
        // Create a new receipt with the zoneId
        const receipt = await Receipt.create({
            name,
            phone,
            amount,
            payment,
            paymenttype,
            zonehead: zoneId, // Attach the authenticated zone's ID
        });

        // Respond with the created receipt details
        res.status(201).json({
            id: receipt._id,
            name: receipt.name,
            phone: receipt.phone,
            amount: receipt.amount,
            payment: receipt.payment,
            paymenttype: receipt.paymenttype,
            zonehead: receipt.zonehead, // Include zone ID
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllReceipts = async (req, res) => {
    const zoneId = req.zone._id; // Authenticated zone's ID

    try {
        // Fetch receipts matching the zoneId
        const receipts = await Receipt.find({ zonehead: zoneId });
        res.status(200).json(receipts); // Return the filtered receipts
    } catch (err) {
        console.error('Error fetching receipts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const receipt = await Receipt.findByIdAndDelete(id); // Find and delete the product
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





module.exports = {
    signin,
    signout,
    addZone,
    upload,
    getAllZones,
    deleteZone,
    generateReceipt,
    getAllReceipts,
    deleteReceipt,
};
