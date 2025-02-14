
import * as style from './index.m.scss' 
import {formatTime} from '../common/utils'

console.log(formatTime('yyyy/MM/dd h:m:s', new Date().getTime()))

export default () => {
    return (
        <div className={style.main}>
            <span>{formatTime('yyyy/MM/dd h:m:s', new Date().getTime())}</span>
        </div>
    )
}
