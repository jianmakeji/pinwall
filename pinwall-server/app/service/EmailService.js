'use strict';

const Service = require('egg').Service;

class Email extends Service {

  async sendActiveEmail(email, activeCode, mailType = 0) {
    const ctx = this.ctx;
    // 开启一个 SMTP 连接池
    await ctx.model.Users.updateUserActiveCodeByEmail(email,acticeCode);
    var transport = nodemailer.createTransport(smtpTransport({
      host: ctx.app.email_host, // 主机
      secure: true, // 使用 SSL
      secureConnection: true, // 使用 SSL
      port: 465, // SMTP 端口
      auth: {
        user: ctx.app.email_user, // 账号
        pass: ctx.app.email_pwd // 密码
      }
    }));

    // 设置邮件内容
    var mailOptions = {
      from: ctx.app.email_send_address, // 发件地址
      to: email, // 收件列表
      subject: "邮件激活", // 标题
    }

    if (mailType == 0){
      mailOptions.text = "您好 ";
      mailOptions.html = '<b>感谢您的访问!</b> <a href="'+ctx.app.email_verify_address
        +'?email='+email+'&acticeCode='+acticeCode+'">请点击激活账号</a>';
    }
    else if (mailType == 1){
      mailOptions.text = "您好，您的激活码为:" + acticeCode;
    }

    // 发送邮件
    await transport.sendMail(mailOptions, function(error, response) {
      if (error) {
        return false;
      } else {
        return true;
      }
      transport.close(); // 如果没用，关闭连接池
    });
  }

}

module.exports = Email;
