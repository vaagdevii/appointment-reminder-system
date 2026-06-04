const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendWhatsAppMessage } = require('../services/twilioService');

cron.schedule('* * * * *', async () => {

  console.log('Checking reminders...');

  const now = new Date();

  const appointments =
    await Appointment.find({
      reminderSent: false
    });

  for (const appointment of appointments) {

    const appointmentTime =
      new Date(appointment.appointmentTime);

    const diffMinutes =
      (appointmentTime - now) / (1000 * 60);

    if (
      diffMinutes > 0 &&
      diffMinutes <= 60
    ) {

      try {

        await sendWhatsAppMessage(
          appointment.phoneNumber,
          `Reminder: Your appointment is scheduled at ${appointmentTime.toLocaleString()}`
        );

        appointment.reminderSent = true;

        await appointment.save();

        console.log(
          `Reminder sent to ${appointment.phoneNumber}`
        );

      } catch (error) {

        console.error(
          'Reminder failed:',
          error.message
        );

      }

    }

  }

});