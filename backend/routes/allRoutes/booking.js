const express = require("express")
const router = express.Router()
const { Reservation } = require("../../db")

router.get("/", (req, res) => {
    res.send("Booking route")
})

router.post('/reserve', async (req, res) => {
    try {
        const { classId, date, startTime, endTime, userId } = req.body;

        // Validate inputs
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ message: "Date, start time, and end time are required" });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "Start time must be before end time" });
        }

        // Check for conflicts on the same date
        const conflict = await Reservation.findOne({
            classId,
            date, // Only check conflicts for the given date
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }  // Overlapping condition
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: "Time slot is already reserved on this date and time" });
        }

        // No conflicts, save the reservation
        const reservation = new Reservation({ classId, date, startTime, endTime, userId });
        await reservation.save();

        res.status(201).json({ message: "Class reserved successfully", reservation });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/unreserve', async (req, res) => {
    try {
        const { reservationId } = req.body;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Optional: Check if the user owns this reservation (requires authentication)
        if (reservation.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to cancel this reservation" });
        }

        // Delete the reservation
        await Reservation.findByIdAndDelete(reservationId);

        res.status(200).json({ message: "Reservation canceled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get('/available', async (req, res) => {
    const { classId, date } = req.body;
    const reservations = await Reservation.find({ classId, date }).sort({ startTime: 1 });
    res.json({ reservations });
});


module.exports = router