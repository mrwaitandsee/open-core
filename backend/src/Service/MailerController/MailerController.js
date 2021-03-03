import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export default class MainController {
  constructor(service, host, user, pass) {
    this.transporter = nodemailer.createTransport(smtpTransport({
      service,
      host,
      auth: {
        user,
        pass,
      },
    }));
  }

  async send(from, to, subject, text) {
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
    }).catch(() => {});
  }
}

