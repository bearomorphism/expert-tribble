"use strict";
import nodemailer from "nodemailer";
import 'dotenv/config';

console.log(process.env.MAIL_ADDRESS)

async function main() {
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        }
    });
    let info = await smtpTransport.sendMail({
        from: `tricuss ${process.env.MAIL_ADDRESS}`, // sender address
        to: "bear890707@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
}

main().catch(console.error);
