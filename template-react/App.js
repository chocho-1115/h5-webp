import React from 'react'
import { NavLink, BrowserRouter, Routes, Route } from 'react-router'
import Index from './pages/index'
import About from './pages/about'

export default function App() {
    return (
        <div className='content'>
            <BrowserRouter>
                <header>
                    <nav>
                        <NavLink to="/">Index</NavLink>
                        <NavLink to="/about">About</NavLink>
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
