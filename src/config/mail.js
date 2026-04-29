export default {
  mailgun: {
    enabled: !!(process.env.MAILGUN_API_USER && process.env.MAILGUN_API_KEY),
    username: process.env.MAILGUN_API_USER || '',
    key: process.env.MAILGUN_API_KEY || '',
    url: 'https://api.eu.mailgun.net'
  },
  default: {
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_PORT || 587,
    from: process.env.SMTP_FROM || "lama@example.com",
    bcc: process.env.SMTP_BLINDCOPY || "",
    secure: process.env.SMTP_SECURE === 'true' || (process.env.SMTP_SECURE !== 'false' && !!process.env.SMTP_SECURE),
    auth: (!process.env.SMTP_USER || !process.env.SMTP_PASS) ? null : {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || ""
    }
  },
  booking: {
    host: process.env.SMTP_BOOKING_HOST || process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_BOOKING_PORT || process.env.SMTP_PORT || 587,
    from: process.env.SMTP_BOOKING_FROM || process.env.SMTP_FROM || "lama@example.com",
    secure: process.env.SMTP_BOOKING_SECURE === 'true' || (process.env.SMTP_BOOKING_SECURE !== 'false' && !!process.env.SMTP_BOOKING_SECURE),
    auth: (!(process.env.SMTP_BOOKING_USER || process.env.SMTP_USER)
        || !(process.env.SMTP_BOOKING_PASS || process.env.SMTP_PASS)) ? null : {
      user: process.env.SMTP_BOOKING_USER || process.env.SMTP_USER || "",
      pass: process.env.SMTP_BOOKING_PASS || process.env.SMTP_PASS || ""
    }
  },
  subscribeLists: JSON.parse(process.env.SUBSCRIBE_LISTS || '[]')
};