import './css/main.scss'
import {remInit} from './common/rem.js'
import { browserDetect } from './common/utils'
import { numClick } from './js/context'
import { useState } from 'react'
import { NavLink, Link, BrowserRouter, Routes, Route } from 'react-router'
import Index from './pages/Home'
import About from './pages/About'

remInit({
    baseWidth: 750,
    maxWidth: browserDetect().isPc ? 750 : null,
    viewportMinHeight: 1334,
    isLandscape: false,
    // zoomOutCriticalValue: !browserDetect().isPc ? 1 / 1 : null,
    // zoomOutCriticalValue: 1334/(750-400),
})

export default function App() {
    const [globalNum, setGlobalNum] = useState(0)

    const [num, setNum] = useState(0)
    function handleClick() {
        setNum(num + 1)
    }
    return (
        <>
            <BrowserRouter>
                <header>
                    点<button onClick={handleClick}>这里</button>会触发所有子组件的render，这是与vue在数据响应上的重要区别，react的性能优化也是围绕这一特性进行的。
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
