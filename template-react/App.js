import './css/main.scss'
import React from 'react'
import { NavLink, Link, BrowserRouter, Routes, Route } from 'react-router'
import Index from './pages/index'
import About from './pages/about'
// import './common/createRoutes'



// console.log(import.meta) // 直接访问模块导出内容

// // 使用 import.meta.glob
// const modules = import.meta.webpackContext('./pages', 
//     // { eager: true }
//     { mode: 'eager' }
//     // mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once';

// ).then((res)=>{
//     console.log(res)
// })

// console.log(modules) // 直接访问模块导出内容





export default function App() {
    return (
        <div className='content'>
            <BrowserRouter>
                <header>
                    <nav>
                        <NavLink to="/">Index</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <Link to="/about">About</Link>
                    </nav>
                </header>
                <Routes>
                    <Route index element={<Index />} />
                    <Route path="/about" element={<About />} />
                    
                </Routes>
            </BrowserRouter>
        </div>
    )
}
