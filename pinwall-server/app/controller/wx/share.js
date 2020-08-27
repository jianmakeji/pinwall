'use strict'

const BaseController = require('../BaseController');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');//在网上查到的readFile同步方式
const readFile = promisify(fs.readFile);
const qr = require('qr-image'); //这个插件是用来画二维码的也很好用
const { createCanvas, loadImage } = require('canvas')

class ShareController extends BaseController {

  async createShareImage() {
    const ctx = this.ctx;
    const artifact = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));


    const canvas = createCanvas(600, 600);
    const canvas_ctx = canvas.getContext('2d');
    console.log(artifact.profileImage);
    await loadImage(artifact.profileImage).then((image) => {
      canvas_ctx.drawImage(image, 50, 0, 300, 300);
    });
    // 画二维码（这里多加了个画二维码的，希望能对你有用）
    const qrUrl = "https://pinwall.design-engine.org/project/" + ctx.params.id;
    
    const qrcode = qr.imageSync(qrUrl, { type: 'png', size: 4, margin: 1 });//可以修改size，margin等格式
    await loadImage(qrcode).then((image) => {
      canvas_ctx.drawImage(image, 50, 360, 70, 70);
    });

    const data = await promisify(canvas.toDataURL).call(canvas, 'image/jpeg');
    const base64 = data.replace(/^data:image\/\w+;base64,/, '');// 去掉图片base64码前面部分data:image/png;base64
    const picUrl = new Buffer(base64, 'base64'); // 把base64码转成buffer对象，
    ctx.set('Content-Type', 'image/jpeg');
    ctx.body = picUrl;

  }

}

module.exports = ShareController;
