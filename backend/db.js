const mongoose = require('mongoose');

function connectDb() {
    try {
        mongoose.connect("mongodb+srv://badwaikparas:paras1234567@cluster0.lmeg5rq.mongodb.net/class_scheduler")
        console.log("db connected successfully")
    } catch (error) {
        console.log("db connection failed")
    }
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

const ReservationSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Class' },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    startTime: { type: String, required: true }, // Format: "HH:MM"
    endTime: { type: String, required: true }, // Format: "HH:MM"
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = {
    connectDb,
    User,
    Reservation
};