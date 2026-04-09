const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

// Verify connection on startup
transporter.verify((err) => {
  if (err) console.error('❌ SMTP connection failed:', err.message);
  else console.log('✅ SMTP ready');
});

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPEmail(email, otp, type) {
  const subject = type === 'verify' ? 'Verify your EtherxWord account' : 'Reset your EtherxWord password';
  const action  = type === 'verify' ? 'verify your account' : 'reset your password';

  try {
    const info = await transporter.sendMail({
      from: `"EtherxWord" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;background:#0f0f0f;color:#e8e0d0;border-radius:8px">
          <h2 style="color:#c9a84c;margin-bottom:8px">EtherxWord</h2>
          <p>Use the code below to ${action}. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#c9a84c;margin:24px 0;text-align:center">
            ${otp}
          </div>
          <p style="font-size:12px;color:#888">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log('✅ OTP email sent to', email, '| MessageId:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err.message);
    throw err;
  }
}

module.exports = { generateOTP, sendOTPEmail };
