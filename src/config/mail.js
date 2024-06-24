export default {
  mailgun: {
    username: process.env.MAILGUN_API_USER || 'api',
    key: process.env.MAILGUN_API_KEY || 'apiKey',
    url: 'https://api.eu.mailgun.net'
  },
  default: {
		host: process.env.SMTP_HOST || "smtp.example.com",
		port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || "username",
    from: process.env.SMTP_FROM || "lama@example.com",
    pass: process.env.SMTP_PASS || "password",
    bcc: process.env.SMTP_BLINDCOPY || "",
    secure: process.env.SMTP_SECURE || false,
  },
  booking: {
    host: process.env.SMTP_BOOKING_HOST || process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_BOOKING_PORT || process.env.SMTP_PORT || 587,
    user: process.env.SMTP_BOOKING_USER || process.env.SMTP_USER || "username",
    from: process.env.SMTP_BOOKING_FROM || process.env.SMTP_FROM || "lama@example.com",
    pass: process.env.SMTP_BOOKING_PASS || process.env.SMTP_PASS || "password",
    secure: process.env.SMTP_BOOKING_SECURE || process.env.SMTP_SECURE || false,
  }
};