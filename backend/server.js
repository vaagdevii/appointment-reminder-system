require('dotenv').config();
require('./cron/reminderCron');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const appointmentRoutes =
require('./routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api/appointments',
  appointmentRoutes
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log('MongoDB Connected');

    app.listen(
      process.env.PORT || 5000,
      () => {
        console.log(
          `Server running on port ${process.env.PORT}`
        );
      }
    );

  })
  .catch((err) => {
    console.log(err);
  });