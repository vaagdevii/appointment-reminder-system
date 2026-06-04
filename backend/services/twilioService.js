const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppMessage = async (
  phoneNumber,
  message
) => {

  try {

    console.log(
      'Sending WhatsApp to:',
      phoneNumber
    );

    const response =
      await client.messages.create({

        from:
          process.env.TWILIO_WHATSAPP_NUMBER,

        to:
          `whatsapp:${phoneNumber}`,

        body:
          message

      });

    console.log(
      'Twilio SID:',
      response.sid
    );

    console.log(
      'Twilio Status:',
      response.status
    );

    return response;

  } catch (error) {

    console.error(
      'TWILIO FULL ERROR:'
    );

    console.error(error);

    throw error;

  }

};

module.exports = {
  sendWhatsAppMessage
};