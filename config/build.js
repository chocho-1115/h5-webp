
let fs = require('fs');
let projectName = process.argv[2];

fs.readFile('./config/projectConfig.json',function(err,data){
    if(err){
        console.error(err);
    }
    var data = data.toString();
    data = JSON.parse(data);
    
    if(projectName&&projectName!='template'){
        data.name = projectName;
        data.srcPath = './src/'+projectName+'/';
        data.distPath = './dist/'+projectName+'/';
    }else{
        data.name = 'template';
        data.srcPath = './template/';
        data.distPath = './dist/'+template+'/';
    }

    var data = JSON.stringify(data);
    
    fs.writeFile('./config/projectConfig.json',data,function(err){
        if(err){
            console.error(err);
        }

        let exec = require('child_process').execSync;
        exec('webpack --config webpack.build.config.js --progress true --env.mode=production', {stdio: 'inherit'});
    })
})
