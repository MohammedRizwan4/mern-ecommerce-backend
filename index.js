const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const auth = require('./routes/auth')
const adminAuth = require('./routes/admin/auth')

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/newProject', () => {
    console.log("Database connected");
})

app.use('/api', auth)
app.use('/api', adminAuth)
app.listen(2000, () => {
    console.log("Server is listening at 2000 port");
})

