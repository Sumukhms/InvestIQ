const sgMail = require('@sendgrid/mail');

// Set the API key directly from the globally available process.env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    // Check if the required environment variables are present
    if (!process.env.EMAIL_USER || !process.env.SENDGRID_API_KEY) {
        console.error('Email environment variables are not set!');
        throw new Error('Email service is not configured.');
    }
    
    const msg = {
        to: options.to,
        from: {
            email: process.env.EMAIL_USER,
            name: 'InvestIQ'
        },
        subject: options.subject,
        html: options.html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully via SendGrid');
    } catch (error) {
        console.error('Error sending email:', error.toString());
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;