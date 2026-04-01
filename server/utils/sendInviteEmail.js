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
      <h2>You're Invited 🎉</h2>
      
      <p>You have been invited to join a group on Expense Split.</p>
      
      <p><strong>To get started:</strong></p>
      <ol>
        <li>Click the button below</li>
        <li>Register your account using the same email</li>
        <li>You will automatically join the group after signup</li>
      </ol>

      <a href="${inviteLink}" 
         style="display:inline-block;padding:10px 16px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;">
         Sign Up & Join Group
      </a>

      <p style="margin-top:10px;">Or copy this link:</p>
      <p>${inviteLink}</p>

      <p><strong>Note:</strong> This invitation link will expire in 7 days.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendInviteEmail;