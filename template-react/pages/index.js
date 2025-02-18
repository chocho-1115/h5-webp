
import * as style from './index.m.scss' 
import {formatTime} from '../common/utils'

export default () => {
    console.log('index')
    return (
        <div className={style.main}>
            <span>{formatTime('yyyy/MM/dd h:m:s', new Date().getTime())}</span>
        </div>
    )
}
