
import * as style from './styles.m.scss' 
import {formatTime} from '../../common/utils'
import Wrap from '../../components/Wrap'

export default () => {
    return (
        <Wrap className={style.wrap}>
            <span>{formatTime('yyyy/MM/dd h:m:s', new Date().getTime())}</span>
        </Wrap>
    )
}
