const fs = require('fs');
const path = require('path');
// const readline = require('readline');

let projectName = process.argv[2];
let srcDir = path.resolve(__dirname, '../template');
let tarDir = path.resolve(__dirname, '../src/'+projectName);

if(!projectName){
	throw '新建项目名称不能为空：npm run create projectName';
}


if(fs.existsSync(tarDir)){
  throw tarDir + ' 目录已存在';
}else{
  fs.mkdir(tarDir, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    copyFolder(srcDir, tarDir);
  });
}


// 将源文件拷贝到目标文件
// 将srcPath路径的文件复制到tarPath
var copyFile = function(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on('error', function(err) {
    if (err) {
      console.log('read error', srcPath);
    }
    cb && cb(err);
  })
 
  var ws = fs.createWriteStream(tarPath);
  ws.on('error', function(err) {
    if (err) {
      console.log('write error', tarPath);
    }
    cb && cb(err);
  })
  ws.on('close', function(ex) {
    cb && cb(ex);
  })
 
  rs.pipe(ws);
}

// 将srcDir文件下的文件、文件夹递归的复制到tarDir下
var copyFolder = function(srcDir, tarDir, cb) {
  fs.readdir(srcDir, function(err, files) {
    var count = 0;
    var checkEnd = function() {
      ++count == files.length && cb && cb();
    }
 
    if (err) {
      checkEnd();
      return;
    }
 
    files.forEach(function(file) {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);
 
      fs.stat(srcPath, function(err, stats) {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath);
          fs.mkdir(tarPath, function(err) {
            if (err) {
              console.log(err);
              return;
            }
 
            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });
 
    //为空时直接回调
    files.length === 0 && cb && cb();
  });
}





