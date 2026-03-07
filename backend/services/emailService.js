const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not configured. Emails will be skipped.');
    return null;
  }
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendFeedbackEmail = async (to, subject, htmlContent, pdfPath) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const mailOptions = {
      from: `"Fund a Child India" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: pdfPath ? [{
        filename: 'feedback.pdf',
        path: require('path').join(__dirname, '..', pdfPath)
      }] : []
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

const buildFeedbackEmailHTML = (mentorName, menteeName, topic, rating, date) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a3a2a; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Fund a Child India</h1>
        <p style="color: #a8d5b5; margin: 5px 0 0;">Session Feedback Submitted</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #1a3a2a;">Feedback Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Mentor:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${mentorName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Mentee:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${menteeName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Topic:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${topic}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Rating:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${date}</td></tr>
        </table>
        <p style="color: #555; margin-top: 20px;">Please find the detailed feedback PDF attached to this email.</p>
      </div>
      <div style="background: #1a3a2a; padding: 15px; text-align: center;">
        <p style="color: #a8d5b5; margin: 0; font-size: 12px;">Fund a Child India | Empowering children through mentorship</p>
      </div>
    </div>
  `;
};

module.exports = { sendFeedbackEmail, buildFeedbackEmailHTML };
