const projectName = require('./project')

const config = {
  name: projectName.name,
  srcPath:'./src/'+projectName.name+'/',
  distPath:'./dist/'+projectName.name+'/'
}

module.exports = config;
