export default {
  mailgun: {
    username: process.env.MAILGUN_API_USER || 'api',
    key: process.env.MAILGUN_API_KEY || 'apiKey',
    url: 'https://api.eu.mailgun.net'
  },
  mailer: {
		host: process.env.SMTP_HOST || "smtp.example.com",
		port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || "username",
    from: process.env.SMTP_FROM || "lama@example.com",
    pass: process.env.SMTP_PASS || "password",
    bcc: process.env.SMTP_BLINDCOPY || "",
  }
};