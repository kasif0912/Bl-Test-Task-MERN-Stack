import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendInviteEmail = async (to, inviteLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "You're invited to join a group",
    html: `
      <h3>You have been invited to join a group</h3>
      <p>Click the link below to join:</p>
      <a href="${inviteLink}">${inviteLink}</a>
      <p>This link will expire in 7 days.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendInviteEmail;
