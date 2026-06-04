const Appointment = require('../models/Appointment');
const { sendWhatsAppMessage } = require('../services/twilioService');

const createAppointment = async (req, res) => {

  try {

    const {
      customerName,
      phoneNumber,
      appointmentTime
    } = req.body;

    const appointment =
      await Appointment.create({
        customerName,
        phoneNumber,
        appointmentTime
      });

    try {

      const formattedDateTime =
        new Date(appointmentTime).toLocaleString(
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
        phoneNumber,
        `Hello ${customerName},

Your appointment is confirmed for ${formattedDateTime}.

Thank you.`
      );

    } catch (error) {

      console.log(
        'WhatsApp failed:',
        error.message
      );

    }

    res.status(201).json(appointment);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getAppointments = async (req, res) => {

  try {

    const appointments =
      await Appointment.find()
      .sort({ appointmentTime: 1 });

    res.status(200).json(appointments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const deleteAppointment = async (req, res) => {

  try {

    await Appointment.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Appointment Deleted'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  createAppointment,
  getAppointments,
  deleteAppointment
};