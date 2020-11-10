const request = require('request');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function getJsonFiles(jsonPath){
    let jsonFiles = [];
    function findJsonFile(localPath){
        let files = fs.readdirSync(localPath);
        files.forEach(function (item, index) {
            let fPath = path.join(localPath, item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory() === true) {
                findJsonFile(fPath);
            }
            if (stat.isFile() === true) {
              jsonFiles.push(fPath);
            }
        });
    }

    findJsonFile(jsonPath);
    return jsonFiles;
}

module.exports.getH5Url = (artifactId, mediaFile, app) => {
    console.log(mediaFile);
    let h5Dir = path.join(app.localH5Path, artifactId + path.sep);

    let pathExist = fs.existsSync(h5Dir);

    if (!pathExist){

      fs.mkdirSync(h5Dir);

      let filename = artifactId + '.zip';

      let stream = fs.createWriteStream(path.join(h5Dir, filename));
      request(mediaFile).pipe(stream).on("close", function (err) {
      });

      stream.on("finish", function() {
        stream.end();
        let ziprarPath = h5Dir + filename;
        var zip = new AdmZip(ziprarPath);
        zip.extractAllTo(h5Dir, true);
        if(fs.existsSync(ziprarPath)){
          fs.unlinkSync(ziprarPath);
        }
      });
    }

    let jsonFiles = getJsonFiles(h5Dir);

    let indexPath = '';
    for (let path of jsonFiles){
      if (path.indexOf('index.html') != -1 && path.indexOf('__MACOSX') == -1){
        indexPath = path;
        break;
      }
    }

    if(indexPath != ''){
      return app.localH5Url + indexPath.replace(app.localH5Path,'');
    }
    else{
      return indexPath;
    }

}
