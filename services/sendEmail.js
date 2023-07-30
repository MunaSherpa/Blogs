const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "munasherpa31@gmail.com",
      pass: "ryaxuilqsdtkorvi",
    },
  });

  const mailOptions = {
    from: "muna <munasherpa31@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: "Your otp is  " + options.otp,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;