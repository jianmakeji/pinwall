'use strict'

const Controller = require('egg').Controller;
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

class EmailController extends Controller{

  async sendActiveEmail() {
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode =  UUID.v1();
    const result = await this.ctx.service.emailService.sendActiveEmail(email,acticeCode);

    if (result) {
      return this.ctx.app.failure('发送失败!');
    } else {
      return this.ctx.app.success('发送成功!');
    }
  }
}

module.exports = EmailController;
