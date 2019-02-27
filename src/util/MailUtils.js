const nodemailer = require('nodemailer');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./mail.properties');

module.exports = { 

    sendEmail : function(toSend, subjectToSend, textToSend, htmlToSend) {
        let transporter = nodemailer.createTransport({
            host: properties.get('host'),
            port: properties.get('port'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: properties.get('email'), // generated ethereal user
                pass: properties.get('password')  // generated ethereal password
            },
            tls: {rejectUnauthorized: false}
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: properties.get('email'), // sender address
            to: toSend,
            subject: subjectToSend, // Subject line
            text: '', // plain text body
            html: htmlToSend // html body,
            
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }
};