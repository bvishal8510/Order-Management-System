const nodemailer = require('nodemailer');
const { smtpusername, smtppassword } = require('../special_config');

/* sending email
    argument {
        to: is single or list of email ids to whom email is to be sent,
        subject: subject of mail,
        html: template of content of email
    } 
*/
async function sendEmail(to, subject, html) {
    try {
        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: smtpusername,
                pass: smtppassword
            }
        });

        await transport.sendMail({
            from: '<phoics100@gmail.com>',
            to: to,
            subject: subject,
            html: html,
        });
        return 1;
    }
    catch (ex) {
        return ex;
    }
}

module.exports = {
    sendEmail,
}