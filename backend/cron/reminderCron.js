const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendWhatsAppMessage } = require('../services/twilioService');

console.log('Reminder Cron Loaded');

const task = cron.schedule('* * * * *', async () => {

  console.log('Checking reminders...');

  try {

    const now = new Date();

    const appointments = await Appointment.find({
      reminderSent: false
    });

    console.log(`Found ${appointments.length} pending appointments`);

    for (const appointment of appointments) {

      const appointmentTime = new Date(appointment.appointmentTime);

      const diffMinutes =
        (appointmentTime.getTime() - now.getTime()) / (1000 * 60);

      console.log(
        `${appointment.customerName} => ${diffMinutes.toFixed(2)} minutes`
      );

      if (diffMinutes > 0 && diffMinutes <= 60) {

        await sendWhatsAppMessage(
          appointment.phoneNumber,
          `Reminder: Your appointment is scheduled in less than 1 hour.`
        );

        appointment.reminderSent = true;
        await appointment.save();

        console.log(
          `Reminder sent to ${appointment.phoneNumber}`
        );
      }

    }

  } catch (error) {

    console.error('Cron Error:', error);

  }

}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

console.log('Cron Status:', task.getStatus());