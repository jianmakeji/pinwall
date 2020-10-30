'use strict'

const BaseController = require('../BaseController');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');//在网上查到的readFile同步方式
const readFile = promisify(fs.readFile);
const qr = require('qr-image'); //这个插件是用来画二维码的也很好用
//const { createCanvas, loadImage, Image} = require('canvas')
//const Canvas = require('canvas');
const {createHash}= require('crypto');
const fileUtil = require('../../utils/fileUtils');

class ShareController extends BaseController {

  async createShareImage() {
    let ctx = this.ctx;
    let multiple = 2;
    /*
    const result = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
    if(result){
      const canvas = createCanvas(multiple * 260, multiple * 410);
      const canvasCtx = canvas.getContext('2d');
      Canvas.registerFont(path.join(__dirname,'../../public/ttf/simsun.ttc'), { family: 'SimSun' });
      canvasCtx.fillStyle = '#FFFFFF';
      canvasCtx.fillRect(0,0,multiple * 260, multiple * 410);

      await loadImage(result.profileImage).then((image) => {
        canvasCtx.drawImage(image, 0, 0, multiple * 260, multiple * 260);
      });

      const qrUrl = 'https://pinwall.cn/mobile/workdetail?artifactId=' + ctx.params.id;
      const qrcode = qr.imageSync(qrUrl, { type: 'png', size: 4, margin: 1 });//可以修改size，margin等格式
      const qrcodeImg = new Image();
      qrcodeImg.src = qrcode;
      canvasCtx.drawImage(qrcodeImg, multiple * 160, multiple * 350, multiple * 36, multiple * 36);

      canvasCtx.font = '36px bold SimSun';
      canvasCtx.fillStyle = '#000000';
      let name = result.name;
      if(name.length > 12){
        name = name.substring(0,11) + '...';
      }
      canvasCtx.fillText(name, 10, multiple * 295);

      canvasCtx.font = '26px SimSun';
      canvasCtx.fillText(result.user.fullname, multiple * 40, multiple * 372);

      canvasCtx.font = '28px SimSun';
      canvasCtx.fillStyle = '#6D7278';
      let topic_name = result.topics[0].name;
      if(topic_name.length > 18){
        topic_name = topic_name.substring(0,17) + ' ...';
      }
      canvasCtx.fillText(topic_name, 10, multiple * 320);

      canvasCtx.font = '24px SimSun';
      canvasCtx.fillText("扫码查看", multiple * 203, multiple * 362);
      canvasCtx.fillText("作品详情", multiple * 203, multiple * 382);

      if(result.user.avatarUrl != null){
        await loadImage(result.user.avatarUrl).then((image) => {
          canvasCtx.drawImage(image, 10, multiple * 355, multiple * 24, multiple * 24);
        });
      }
      else{
        const img = new Image();
        img.onload = () => canvasCtx.drawImage(img, 10, multiple * 355, multiple * 24, multiple * 24);
        img.onerror = err => { throw err }
        img.src = path.join(__dirname,'../..' + '/public/images/mobile/default_head_img.png');
      }

      const data = await promisify(canvas.toDataURL).call(canvas, 'image/png');
      const base64 = data.replace(/^data:image\/\w+;base64,/, '');// 去掉图片base64码前面部分data:image/png;base64
      const picUrl = new Buffer(base64, 'base64'); // 把base64码转成buffer对象，
      this.ctx.set('Content-Type', 'image/png');
      this.ctx.body = picUrl;
    }
    else{
      this.ctx.body = null;
    }*/
  }

  async getSingnature(){
    let ctx = this.ctx;
    let noncestr = ctx.query.noncestr;
    let timestamp = ctx.query.timestamp;
    let shareUrl = "https://pinwall.cn/mobile/workdetail?artifactId=" + ctx.query.Id;
    try{
      let accessTokenPath = path.join(__dirname,'../../../config/wx_access_token.json');
      let ticketPath = path.join(__dirname,'../../../config/wx_ticket.json');
      let accessTokenJson = fileUtil.readConfigJson(accessTokenPath);
      let access_token = '';
      let accessTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx72c619c97837ad21&secret=fa139272b80d16116eff88680d5b545d";
      let currentDate = new Date();
      if(accessTokenJson != null){

        let getAccessTokenTime = new Date(accessTokenJson.getAccessTokenTime);
        let seconds = (currentDate.getTime() - getAccessTokenTime.getTime()) / 1000;
        if(typeof(accessTokenJson.expire) == 'undefined' || seconds > accessTokenJson.expire){
          const result = await ctx.curl(accessTokenUrl, {
            method: 'GET',
            dataType: 'json',
          });
          access_token = result.data.access_token;
          let data = {
            expire:result.data.expires_in,
            getAccessTokenTime:currentDate,
            access_token:access_token,
          };
          fileUtil.writeConfigJson(accessTokenPath,data);
        }
        else{
          access_token = accessTokenJson.access_token;
        }
      }
      else{
        const result = await ctx.curl(accessTokenUrl, {
          method: 'GET',
          dataType: 'json',
        });
        access_token = result.data.access_token;
        let data = {
          expire:result.data.expires_in,
          getAccessTokenTime:currentDate,
          access_token:access_token,
        };
        fileUtil.writeConfigJson(accessTokenPath,data);
      }

      let jsapi_ticket = '';
      let ticketJson = fileUtil.readConfigJson(ticketPath);
      let ticketUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi";
      if(ticketJson != null){
        let getAccessTokenTime = new Date(ticketJson.getAccessTokenTime);
        let seconds = (currentDate.getTime() - getAccessTokenTime.getTime()) / 1000;
        if(typeof(ticketJson.expire) == 'undefined' || seconds > ticketJson.expire){
          const result = await ctx.curl(ticketUrl, {
            method: 'GET',
            dataType: 'json',
          });
          jsapi_ticket = result.data.ticket;
          let data = {
            expire:result.data.expires_in,
            getAccessTokenTime:currentDate,
            ticket:jsapi_ticket,
          };
          fileUtil.writeConfigJson(ticketPath,data);
        }
        else{
          jsapi_ticket = ticketJson.ticket;
        }
      }
      else{
        const result = await ctx.curl(ticketUrl, {
          method: 'GET',
          dataType: 'json',
        });
        jsapi_ticket = result.data.ticket;
        let data = {
          expire:result.data.expires_in,
          getAccessTokenTime:currentDate,
          ticket:jsapi_ticket,
        };
        fileUtil.writeConfigJson(ticketPath,data);
      }

      let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp +'&url=' + shareUrl;
      let hash = createHash('sha1');
      hash.update(str);
      let signature = hash.digest('hex');
      super.success(signature);
    }
    catch(e){
      console.log(e);
      super.failure(e.message);
    }

  }

}

module.exports = ShareController;
