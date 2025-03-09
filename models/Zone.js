const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const zoneSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        zonename: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        note: { type: String, required: false },
        zoneId: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected', 'active', 'inactive'], default: 'active' },
        role: { type: String, enum: ['zone', 'unit', 'user', 'member', 'admin'], default: 'zone' },
        image: { type: String, required: false },
    },
    { timestamps: true }
);

// Hash password before saving
// zoneSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// Compare entered password with hashed password
// zoneSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('Zone', zoneSchema);
