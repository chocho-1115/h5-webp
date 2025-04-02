import * as style from './styles.m.scss' 
import { NavLink } from 'react-router'

export default () => {

    console.log('Header render')

    return (
        <header className={style.header}>
            <nav>
                <NavLink to="/">Index</NavLink>
                <NavLink to="/about">About</NavLink>
                {/* <Link to="/about">About</Link> */}
            </nav>
        </header>
    )
}