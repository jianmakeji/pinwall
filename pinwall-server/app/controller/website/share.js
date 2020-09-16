'use strict'

const BaseController = require('../BaseController');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');//在网上查到的readFile同步方式
const readFile = promisify(fs.readFile);
//const { createCanvas, loadImage, Image } = require('canvas')
//const qr = require('qr-image');

class ShareController extends BaseController{
    async createShareImage(){
      const result = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
      if(result){
        const canvas = createCanvas(260, 380)
        const canvasCtx = canvas.getContext('2d')

        await loadImage(result.profileImage).then((image) => {
          canvasCtx.drawImage(image, 0, 0, 260, 260);
        });

        const qrUrl = '';
        const qrcode = qr.imageSync(qrUrl, { type: 'png', size: 4, margin: 1 });//可以修改size，margin等格式
        const qrcodeImg = new Image();
        qrcodeImg.src = qrcode;

        canvasCtx.drawImage(qrcodeImg, 36, 36, 200, 300);

        // Write "Awesome!"
        ctx.font = '22px Impact';
        ctx.fillStyle = '#000000';
        ctx.fillText(result.name, 10, 270);

        ctx.font = '13px Impact';
        ctx.fillText(result.user.fullname, 35, 320);

        ctx.font = '16px Impact';
        ctx.fillStyle = '#6D7278';
        ctx.fillText(result.topics[0].name, 10, 290);
        
        if(result.user.avatarUrl != null){
          await loadImage(result.user.avatarUrl).then((image) => {
            canvasCtx.drawImage(image, 24, 24, 10, 310);
          });
        }
        else{
          const img = new Image();
          img.onload = () => canvasCtx.drawImage(img, 24, 24, 10, 310);
          img.onerror = err => { throw err }
          img.src = '/public/images/mobile/default_head_img.png';
        }
        const data = await promisify(canvas.toDataURL).call(canvas, 'image/jpeg');
        const base64 = data.replace(/^data:image\/\w+;base64,/, '');// 去掉图片base64码前面部分data:image/png;base64
        const picUrl = new Buffer(base64, 'base64'); // 把base64码转成buffer对象，
        this.ctx.set('Content-Type', 'image/jpeg');
        this.ctx.body = picUrl;
      }
      else{
        this.ctx.body = null;
      }
    }
}

module.exports = ShareController;
