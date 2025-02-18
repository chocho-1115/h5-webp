import './css/main.scss'
import { numClick } from './js/context'
import { useState } from 'react'
import { NavLink, Link, BrowserRouter, Routes, Route } from 'react-router'
import Index from './pages/index'
import About from './pages/about'

export default function App() {
    const [globalNum, setGlobalNum] = useState(0)
    return (
        <>
            <BrowserRouter>
                <header>
                    <nav>
                        <NavLink to="/">Index</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <Link to="/about">About</Link>
                    </nav>
                </header>
                <div className='content'>
                    <numClick.Provider value={globalNum}>
                        <Routes>
                            <Route index element={<Index />} />
                            <Route path="/about" element={
                                <About setGlobalNum={setGlobalNum} />
                            } />
                        </Routes>
                    </numClick.Provider>
                </div>
            </BrowserRouter>
        </>
    )
}
