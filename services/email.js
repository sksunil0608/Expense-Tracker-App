require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send a forgot password email
const sendEmail = async (obj) => {
    const msg = obj;

    try {
        const response = await sgMail.send(msg);
        return {status:response[0].statusCode}
    } catch (error) {
        console.error('Error sending Email:', error);
        throw error; 
    }
};


module.exports = {
    sendEmail,
};
