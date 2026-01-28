const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,              // ✅ MISSING
      secure: false,          // ✅ MISSING
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    
    await transporter.verify();
    console.log("SMTP READY ✅");

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("MAIL SENT ✅", info.response);
    return info;
  } catch (error) {
    console.log("MAIL ERROR ❌", error);
  }
};

module.exports = mailSender;
