const nodemailer = require('nodemailer')
const { forgetPasswordStyling } = require('./emailTemplateDesign')

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
        html: forgetPasswordStyling(token)
        // html: `
        //     <html>
        //         <head>
        //             <style>
        //                 h1 {color: #2c3e50; }
        //                 p {font-size: 16px; color: #34495e; }
        //                 a {display: inline-block; background-color: #3498db; text-color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        //                 .link-container { margin: 20px 0; }
        //                 .note {font-size: 14px; color: #7f8c8d; }
        //             </style>
        //         </head>
        //         <body>
        //             <h1>Reset Your Password</h1>
        //             <p>Click on the following link to reset your password:</p>
        //             <div class="link-container">
        //                 <a href="http://localhost:4040/users/resetPassword/${token}">Reset Password</a>
        //             </div>
        //             <p class="note">The link will expire in 10 minutes.</p>
        //             <p class="note">If you didn't request a password reset, please ignore this email.</p>
        //             <p>Best Regards,<br />The My Fitness Hub Team</p>
        //         </body>
        //     </html>
        //     `
    }
    transporter.sendMail(mailBody, (error, info) => {
        if (error) {
            console.log('Error While sending Forget Password Email', error.message)
        } else {
            console.log('Forget Password Email sent successfully', info.response)
        }
    })
}

const sendInvitationEmail = (email, token, coachFirstName, coachLastName) => {
    const mailBody = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: `Join with ${coachFirstName} ${coachLastName} at My Fitness Hub!`,
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font - family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                        .outer-container {
                            display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                    }
                        .container {
                            background - color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        width: 80%;
                        max-width: 600px;
                        margin: 20px auto;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                        .header {
                            text - align: center;
                        color: #333333;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                        .content {
                            line - height: 1.6;
                        color: #333333;
                    }
                        .button-container {
                            text - align: center;
                        margin-top: 20px;
                    }
                        .button {
                            display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff !important;
                        background-color: #007bff;
                        text-decoration: none;
                        border-radius: 5px;
                        text-align: center;
                    }
                        .footer {
                            margin - top: 20px;
                        font-size: 12px;
                        color: #666666;
                        text-align: center;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="header">You're Invited to Join My Fitness Hub!</h1>
                        <div class="content">
                            <p>Dear Friend,</p>
                            <p>${coachFirstName} ${coachLastName} is excited to invite you to My Fitness Hub, a place where you can achieve your fitness goals and stay motivated.</p>
                            <p>Click the button below to accept the invitation and start your journey towards a healthier lifestyle. Please note that this link is valid for 48 hours.</p>
                        </div>
                        <div class="button-container">
                            <a href="http://example.com/invite?token=${token}" class="button" style="color: #ffffff !important; background-color: #007bff; display: inline-block; padding: 10px 20px; text-decoration: none; border-radius: 5px; text-align: center;">Join Now</a>
                        </div>
                        <div class="footer">
                            <p>If you have any questions, feel free to reach out to us at support@myfitnesshub.com.</p>
                            <p>Best regards,<br>The My Fitness Hub Team</p>
                        </div>
                    </div>
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

module.exports = { welcomeEmail, forgetPasswordMail, sendInvitationEmail }