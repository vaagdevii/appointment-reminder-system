const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendWhatsAppMessage } = require('../services/twilioService');

cron.schedule('* * * * *', async () => {

  try {

    console.log('Checking reminders...');

    const now = new Date();

    const appointments = await Appointment.find({
      reminderSent: false
    });

    console.log(
      `Found ${appointments.length} pending appointments`
    );

    for (const appointment of appointments) {

      try {

        const appointmentTime =
          new Date(appointment.appointmentTime);

        const diffMinutes =
          (appointmentTime - now) / (1000 * 60);

        console.log(
          `${appointment.customerName} => ${diffMinutes.toFixed(2)} minutes`
        );

        if (
          diffMinutes > 0 &&
          diffMinutes <= 60
        ) {

          const formattedDateTime =
            appointmentTime.toLocaleString(
              'en-IN',
              {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }
            );

          await sendWhatsAppMessage(
            appointment.phoneNumber,
            `Reminder:

Your appointment is scheduled for ${formattedDateTime}.

Please be available on time.`
          );

          appointment.reminderSent = true;
          await appointment.save();

          console.log(
            `Reminder sent to ${appointment.phoneNumber}`
          );

        }

      } catch (err) {

        console.error(
          'Appointment processing error:',
          err
        );

      }

    }

  } catch (err) {

    console.error(
      'Cron job error:',
      err
    );

  }

});