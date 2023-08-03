import nodemailer from "nodemailer"
import { MailProps } from "../validations/interface/userTypes";


export const sendMail = async (email: string, subject: string, html: string) => {
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: `emmax-store "no-reply@emmax-store.com"`,
        replyTo: 'no-reply@emmax-store.com',
        to: email,
        subject: subject,
        html: html
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}