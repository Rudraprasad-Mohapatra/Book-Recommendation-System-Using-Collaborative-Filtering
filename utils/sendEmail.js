import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        port: process.env.SMTP_PORT,               // true for 465, false for other ports
        host: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: email,
        subject: subject,
        html: message,
        attachments: [
            {
                filename: 'img101.jfif',
                path: "../static/img1.jfif"
            },
            {
                filename: 'img101.jfif',
                path: "../static/img1.jfif"
            }
        ]
    });
}
export default sendEmail;


