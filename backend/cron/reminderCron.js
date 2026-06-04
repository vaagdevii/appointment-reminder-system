const Appointment = require('../models/Appointment');
const { sendWhatsAppMessage } = require('../services/twilioService');

console.log('Reminder Service Started');

setInterval(async () => {

  console.log('Checking reminders...');

  try {

    const now = new Date();

    const appointments = await Appointment.find({
      reminderSent: false
    });

    for (const appointment of appointments) {

      const appointmentTime =
        new Date(appointment.appointmentTime);

      const diffMinutes =
        (appointmentTime.getTime() - now.getTime()) /
        (1000 * 60);

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

    }

  } catch (error) {

    console.error(
      'Reminder Error:',
      error
    );

  }

}, 60000);