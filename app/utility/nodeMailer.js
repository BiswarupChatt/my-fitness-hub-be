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
                        h1 {color: green;}
                        p {font-size: 16px; color: #333; }
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

const forgetPasswordMail = (email, token) => {
    const mailBody = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Reset Password",
        html: `
            <html>
                <head>
                    <style>
                        h1 {color: #2c3e50; }
                        p {font-size: 16px; color: #34495e; }
                        a {display: inline-block; background-color: #3498db; text-color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                        .link-container { margin: 20px 0; }
                        .note {font-size: 14px; color: #7f8c8d; }
                    </style>
                </head>
                <body>
                    <h1>Reset Your Password</h1>
                    <p>Click on the following link to reset your password:</p>
                    <div class="link-container">
                        <a href="http://localhost:4040/users/resetPassword/${token}">Reset Password</a>
                    </div>
                    <p class="note">The link will expire in 10 minutes.</p>
                    <p class="note">If you didn't request a password reset, please ignore this email.</p>
                    <p>Best Regards,<br />The My Fitness Hub Team</p>
                </body>
            </html>
            `
    }
    transporter.sendMail(mailBody, (error, info) => {
        if (error) {
            console.log('Error While sending Forget Password Email', error.message)
        } else {
            console.log('Forget Password Email sent successfully', info.response)
        }
    })
}

module.exports = { welcomeEmail, forgetPasswordMail }