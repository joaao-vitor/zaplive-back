import nodemailerConfig from 'src/config/nodemailer.config';
import nodemailer from 'nodemailer';

interface sendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = ({ to, subject, html }: sendEmailParams) => {
    const transposter = nodemailer.createTransport(nodemailerConfig);
    return transposter.sendMail({
        from: 'ZapLive',
        to,
        subject,
        html,
    });
};
