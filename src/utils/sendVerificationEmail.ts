import { sendEmail } from './sendEmail';

interface sendVerificationParams {
    name: string;
    email: string;
    verificationToken: string;
    origin: string;
}

export const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin,
}: sendVerificationParams) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

    const message = `<p>Confirm your email clicking on the link below:
  <a href="${verifyEmail}">Verify email</a> </p>`;

    return sendEmail({
        to: email,
        subject: 'Verification email',
        html: `<h4> Hi, ${name}</h4>
    ${message}
    `,
    });
};
