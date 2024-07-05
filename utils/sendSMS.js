const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials (account SID and auth token) are required.');
}

const client = new twilio.Twilio(accountSid, authToken);

async function sendSMS(phoneNumber, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phoneNumber
    });
    console.log(`Message sent to ${phoneNumber}: ${response.sid}`);
    return response;
  } catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error);
    throw error;
  }
}

module.exports = sendSMS;
