require('dotenv').config();
const candymail = require('candymail');
const express = require('express');
const app = express();
const port = 3007;
const automation = require('./candymail.automation.json') 
candymail.init(automation.workflows, {
    mail: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: true,
        },
    },
    hosting: {
        url: process.env.HOSTING_URL
    },
    db: {
        reset: true
    },
    debug: {
        trace: true
    },
}).then((e) => {
    candymail.start();
    app.get('/', async (req, res) => {
        res.send('Go to /start to trigger the first workflow');
    });

    app.post('/signup', (req, res) => {
        const user = process.env.RECIPIENT_EMAIL;
        candymail.runWorkflow('onboarding', user);
        res.send('onboarding started');
    })

    app.get('/unsubscribe', (req, res) => {
        const {
            email
        } = req.query;
        
        candymail.unsubscribeUser(email);
        res.send(`Sent an unsubscribe request for ${email}`);
    })
    app.listen(port, () => {
        console.log(`Learn about our new features at http://localhost:${port}`)
    });
})