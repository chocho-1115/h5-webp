
export function getProjectConfig (name = '') {
    if(!name) return null
    let info = {
        name: name,
        dist: `./dist/${name}/`
    }
    if (['template', 'template-vue', 'template-vue3'].indexOf(name) > -1) {
        info.src = `./${name}/`
    } else {
        info.src = `./src/${name}/`
    }
    return info
}


