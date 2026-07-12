const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT || '2525', 10),
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    });
  }

  /**
   * Helper to compile and send mail options.
   */
  async sendEmail(to, subject, text, html) {
    const mailOptions = {
      from: `"TransitOps Notifications" <no-reply@transitops.com>`,
      to,
      subject,
      text,
      html
    };

    // If SMTP details are empty (development default), print to logger and succeed
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logger.info(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`);
      logger.debug(`Text Body:\n${text}`);
      return { messageId: 'mock-id-12345' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(email, fullName) {
    const subject = 'Welcome to the TransitOps Platform';
    const text = `Hello ${fullName},\n\nWelcome to TransitOps! Your staff account has been created successfully.\n\nBest regards,\nTransitOps Admin`;
    const html = `<h3>Hello ${fullName},</h3><p>Welcome to TransitOps! Your staff account has been created successfully.</p><br><p>Best regards,<br>TransitOps Admin</p>`;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendPasswordResetEmail(email, resetUrl) {
    const subject = 'TransitOps Password Reset Request';
    const text = `You are receiving this email because you (or someone else) requested a password reset.\n\nPlease click on the following link to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
    const html = `<p>You are receiving this email because you (or someone else) requested a password reset.</p><p>Please click on the link below to complete the process:</p><a href="${resetUrl}">${resetUrl}</a><br><p>If you did not request this, please ignore this email.</p>`;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendLicenseExpiryReminder(email, driverName, expiryDate) {
    const subject = 'URGENT: Driver License Expiry Reminder';
    const text = `Hello Operations,\n\nThis is a notification that the commercial driving license for ${driverName} is set to expire on ${expiryDate}.\n\nPlease update their driver profile once renewed to prevent dispatch lockouts.\n\nBest regards,\nTransitOps Compliance`;
    const html = `<h3>Hello Operations,</h3><p>This is a notification that the commercial driving license for <strong>${driverName}</strong> is set to expire on <strong>${expiryDate}</strong>.</p><p>Please update their driver profile once renewed to prevent dispatch lockouts.</p><br><p>Best regards,<br>TransitOps Compliance</p>`;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendMaintenanceReminder(email, vehicleReg, date) {
    const subject = 'Scheduled Vehicle Maintenance Reminder';
    const text = `Hello Fleet Supervisor,\n\nVehicle ${vehicleReg} is scheduled for shop service on ${date}.\n\nPlease coordinate route timings to ensure the vehicle is available for drop-off.\n\nBest regards,\nTransitOps Fleet Operations`;
    const html = `<h3>Hello Fleet Supervisor,</h3><p>Vehicle <strong>${vehicleReg}</strong> is scheduled for shop service on <strong>${date}</strong>.</p><p>Please coordinate route timings to ensure the vehicle is available for drop-off.</p><br><p>Best regards,<br>TransitOps Fleet Operations</p>`;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendTripNotification(email, tripId, status) {
    const subject = `Trip Alert: Trip #${tripId} status is now ${status}`;
    const text = `Hello Dispatcher,\n\nTrip #${tripId} has been updated to: ${status}.\n\nCheck the dashboard for routing and driver details.`;
    const html = `<h3>Hello Dispatcher,</h3><p>Trip <strong>#${tripId}</strong> has been updated to: <strong>${status}</strong>.</p><br><p>TransitOps Dispatch Center</p>`;
    return await this.sendEmail(email, subject, text, html);
  }
}

module.exports = new EmailService();
