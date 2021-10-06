const nodemailer = require('nodemailer');
const ejs = require("ejs");
const smtpTransport = require('nodemailer-smtp-transport');
const path = require("path");

var mail_helper = {}
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail', // hostname
    tls: {rejectUnauthorized: false},
    auth: {
        user: 'Your-email-address',
        pass: 'Your-password'
    }
}));

mail_helper.send = (template_name, options, data, callback) => {

    ejs.renderFile(path.join(__dirname, "../emails/"+template_name+ "/html.ejs"), {
        confirm_link: "https://nodejs.org/en/"
    })
    .then(result => {
        emailTemplate = result;

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'Your-email-address',
                pass: 'Your-password'
            }
        });

        var mailOptions = {
            from: 'Your-email-address',
            to: 'Your-email-address',
            subject: 'Scheduled Email',
            text: 'Hi there. This email was automatically sent by Tagline.',
            html: emailTemplate
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent:');
        });
    }).catch(err => {
        console.log(`err`, err)
    });

};

module.exports = mail_helper