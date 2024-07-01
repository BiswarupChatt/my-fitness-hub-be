const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

const welcomeEmail = (userEmail) => {
    const mailBody = {
        from: process.env.NODEMAILER_EMAIL,
        to: userEmail,
        subject: "Welcome to My Fitness Hub",
        html: `
            <html>
                <head>
                    <style>
                        h1 {color: green; text-align: center; }
                        p {font - size: 16px; color: #333; }
                        .highlight {font-weight: bold; color: #d9534f; }
                    </style>
                </head>
                <body>
                    <h1>Welcome to My Fitness Hub!</h1>
                    <p>Thank you for registering at My Fitness Hub. We are thrilled to have you on board.</p>
                    <p class="highlight">Get started today and unlock your full potential!</p>
                    <p>Best Regards,<br />The My Fitness Hub Team</p>
                </body>
            </html>
           `
    }

    transporter.sendMail(mailBody, (error, info) => {
        if (error) {
            console.log('Error While sending Registration Email', error.message)
        } else {
            console.log('Registration Email sent successfully', info.response)
        }
    })
}

module.exports = { welcomeEmail }