const name = process.env.PROJECTNAME

export default {
    name,
    dist: `./dist/${name}/`,
    src: ['template', 'template-vue', 'template-vue3'].indexOf(name) > -1 ? `./${name}/` : `./src/${name}/`
}


