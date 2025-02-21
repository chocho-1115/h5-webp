import { useState } from 'react'
import { numClick } from '../../js/context'
import { useContext } from 'react'

import Wrap from '../../components/Wrap'

export default ({ setGlobalNum }) => {

    const numClick_data = useContext(numClick)
    const [num, setNum] = useState(0)

    function handleClick() {
        setNum(num + 1)
    }

    function handleClick2() {
        setGlobalNum(numClick_data+1)
    }

    return (
        <Wrap>
            <div className="about">
            useState: {num} <button onClick={handleClick}>add</button><br/>
            useContext: {numClick_data} <button onClick={handleClick2}>add</button><br/>
            </div>
        </Wrap>
    )
}