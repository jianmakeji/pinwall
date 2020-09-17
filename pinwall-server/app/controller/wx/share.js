'use strict'

const BaseController = require('../BaseController');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');//在网上查到的readFile同步方式
const readFile = promisify(fs.readFile);
const qr = require('qr-image'); //这个插件是用来画二维码的也很好用
const { createCanvas, loadImage, Image} = require('canvas')
const Canvas = require('canvas');

class ShareController extends BaseController {

  async createShareImage() {
    let ctx = this.ctx;
    let multiple = 2;
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

      const qrUrl = 'http://192.168.3.110:7001/mobile/workdetail?artifactId=' + ctx.params.id;
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
    }
  }

}

module.exports = ShareController;
