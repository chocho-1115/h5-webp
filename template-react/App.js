import './css/main.scss'
import {remInit} from '~/common/rem.js'
import { browserDetect } from '~/common/utils.js'
import { numClick } from './js/context'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Header from './containers/Header'
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
        console.log('会触发所有子组件的render，这是与vue在数据响应上的重要区别，react的性能优化也是围绕这一特性进行的。')
        setNum(num + 1)
    }
        
    return (
        <>
            <BrowserRouter>
                <Header />
                <div className='content' onClick={handleClick}>
                    <numClick.Provider value={globalNum}>
                        <Routes>
                            <Route index element={<Index />} />
                            <Route path="/about" element={<About setGlobalNum={setGlobalNum} />} />
                        </Routes>
                    </numClick.Provider>
                </div>
            </BrowserRouter>
        </>
    )
}
