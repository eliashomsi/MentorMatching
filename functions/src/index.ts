const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

exports.sendWelcomeEmail = functions.https.onRequest((req:any, res:any) => {
    cors(req, res, () => {
      
        
        const dest = req.query.dest;

        const mailOptions = {
            from: 'Mentor Me <mentorme.official0@gmail.com>', 
            to: dest,
            subject: 'Welcome to Mentor Me!!!', 
            html: 
            `
                <p> Mentor Me is a platform where everyone try to find their dream job!! let us help you! </p>
                <p> We hope you enjoy our website! </p>
            ` 
        };
  
        
        return transporter.sendMail(mailOptions, (error:any, _:any) => {
            if(error){
                return res.send(error.toString());
            }
            return res.send('Sended');
        });
    });    
});


exports.sendMatchEmail = functions.https.onRequest((req:any, res:any) => {
    cors(req, res, () => {
      
        
        const dest = req.query.dest;
        const who = req.query.who;

        const mailOptions = {
            from: 'Mentor Me <mentorme.official0@gmail.com>', 
            to: dest,
            subject: 'You got a match!', 
            html: 
            `
                <p style="font-size: 16px;">you got a match with ${who} </p>
                <p> check it out on the chats page </p>
            ` 
        };
        
        return transporter.sendMail(mailOptions, (error:any, _:any) => {
            if(error){
                return res.send(error.toString());
            }
            return res.send('Sended');
        });
    });    
});
