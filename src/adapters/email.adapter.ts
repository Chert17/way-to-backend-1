import { createTransport } from 'nodemailer';

export const emailAdapter = {
  sendEmail: async (
    email: string,
    subject: string,
    message: string
  ): Promise<true | null> => {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.TEST_EMAIL,
        pass: process.env.TEST_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `BACK HW-07 <${process.env.TEST_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
    });

    if (!info.messageId) return null; // message not sent

    return true;
  },
};
