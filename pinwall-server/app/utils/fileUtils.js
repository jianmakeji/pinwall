const fs = require('fs');

function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

function readConfigJson(filePath){
  let rawdata = fs.readFileSync(filePath);
  
  if(rawdata && rawdata != ''){
    return JSON.parse(rawdata);
  }
  else{
    return null;
  }
}

function writeConfigJson(filePath, jsonStr){
  let data = JSON.stringify(jsonStr);
  fs.writeFileSync(filePath, data);
}

module.exports = {
  delDir:delDir,
  readConfigJson:readConfigJson,
  writeConfigJson:writeConfigJson,
}
