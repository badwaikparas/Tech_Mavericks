const express = require("express")
const cors = require("cors");
const { connectDb } = require("./db")
const allRoutes = require("./routes/routes")


require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(allRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb()
})
