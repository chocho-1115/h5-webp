// import fs from 'fs'
// import path from 'path'




export function RouteList() {
    return (
        <img
            src="https://i.imgur.com/QIrZWGIs.jpg"
            alt="Alan L. Hart"
        />
    )
}

export function navList() {
    return (
        <img
            src="https://i.imgur.com/QIrZWGIs.jpg"
            alt="Alan L. Hart"
        />
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

