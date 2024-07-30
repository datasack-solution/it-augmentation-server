import nodemailer from 'nodemailer';


export const sendEmail = async (email: string, subject: string, htmlTemplate: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL || '',
        to: email,
        subject,
        html: htmlTemplate,
        text,
    };
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL || '',
            pass: process.env.PASSWORD || '',
        },
    });

    return await transporter.sendMail(mailOptions);
};