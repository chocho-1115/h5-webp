import { lazy } from 'react'
import { NavLink, Link, BrowserRouter, Routes, Route } from 'react-router'
// import Index from '../pages/index'
// const About = lazy(() => import('../pages/About')) // 动态导入



console.log(import.meta) // 直接访问模块导出内容

const context = import.meta.webpackContext('../pages', {
    recursive: true, // 递归

    regExp: /\.js$/, // 匹配
    mode: 'eager', // mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once';
    // exclude: /three/, // 排除
})

let list = context.keys().map((path, meta) => {
    console.log(path, meta)

    let dir = path.replace(/^\./, '../pages')
    

    let fileName = path.match(/([^/]+)$/)[0].replace(/(\.js)$/, '')
    fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)

    return {
        name: fileName,
        path: path.substr(1).replace(/(index\.js|\.js)$/, ''),
        // component: () => import(path),
        component: () => import(dir) // .concat(updatedContent),
        // meta
    }
    // const pathWithoutLeadingDot = filePath.replace('.', '') // remove first dot of ./path-name
    // return require(`@/pages${pathWithoutLeadingDot}`).default
})
// .then((res)=>{
//     console.log(res)
// })

console.log(list) // 直接访问模块导出内容
console.log(context) // 直接访问模块导出内容



export default function () {
    
    const RouteList = list.map((item, index) => {
        const Component = lazy(item.component)
        return <Route key={index} index path={item.path} element={<Component />} />
    })
    
    return (
        <BrowserRouter>
            <header>
                <nav>
                    <NavLink to="/">Index</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <Link to="/about">About</Link>
                </nav>
            </header>
            <Routes>
                {RouteList}
                
            </Routes>
            {/* <Routes>
                <Route index element={<Index />} />
                <Route path="/about" element={<About />} />
                    
            </Routes> */}
        </BrowserRouter>
    )
}




// export function generateRoutes() {
//     const pagesDirectory = path.resolve(__dirname, './src/pages')

//     const routeComponents = fs
//         .readdirSync(pagesDirectory)
//         .filter((file) => fs.statSync(path.join(pagesDirectory, file)).isDirectory())
//         .map((directory) => ({
//             path: `/${directory}`,
//             component: `./pages/${directory}/index.js`,
//         }))

//     const routesContent = `
//     import React from 'react';
//     import { Route, Switch } from 'react-router-dom';
//     ${routeComponents
//         .map(
//             (route) =>
//                 `import ${route.path.replace('/', '')} from "${route.component}";`
//         )
//         .join('\n')}

//     const AppRouter = () => {
//       return (
//         <Switch>
//           ${routeComponents
//         .map((route) => `<Route path="${route.path}" component={${route.path.replace('/', '')}} />`)
//         .join('\n')}
//         </Switch>
//       );
//     };

//     export default AppRouter;
//   `

//     fs.writeFileSync(
//         path.resolve(__dirname, './src/AppRouter.js'),
//         routesContent
//     )
// }

