const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  appointmentConfirmation: (data) => ({
    subject: 'Appointment Confirmed - MedScheduler',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Appointment Confirmed</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been successfully confirmed with the following details:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${new Date(data.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.appointmentTime}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>MedScheduler Team</p>
      </div>
    `
  }),
  
  appointmentReminder: (data) => ({
    subject: 'Appointment Reminder - MedScheduler',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Appointment Reminder</h2>
        <p>Dear ${data.patientName},</p>
        <p>This is a reminder for your upcoming appointment:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${new Date(data.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.appointmentTime}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>MedScheduler Team</p>
      </div>
    `
  }),
  
  appointmentCancellation: (data) => ({
    subject: 'Appointment Cancelled - MedScheduler',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">Appointment Cancelled</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been cancelled:</p>
        <div style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${new Date(data.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.appointmentTime}</p>
          <p><strong>Reason for cancellation:</strong> ${data.cancellationReason}</p>
        </div>
        <p>You can book a new appointment at any time through our website.</p>
        <p>Best regards,<br>MedScheduler Team</p>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Password Reset - MedScheduler',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Dear ${data.name},</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>MedScheduler Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, html, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html };
    }

    const mailOptions = {
      from: `"MedScheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, template, data) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        to: recipient.email,
        template,
        data: { ...data, patientName: recipient.name }
      });
      results.push({ email: recipient.email, success: true, messageId: result.messageId });
    } catch (error) {
      results.push({ email: recipient.email, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
};
