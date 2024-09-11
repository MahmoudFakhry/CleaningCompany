const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Send email function
exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { message, userName } = data;

  // Construct the email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'hassanfakhryPersonal@gmail.com',
    subject: `Contact Us Message from ${userName}`,
    text: message,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
});
