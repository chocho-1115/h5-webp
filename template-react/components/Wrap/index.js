import * as style from './styles.m.scss' 

export default ({ children, className }) => {
    return (
        <section className={`${style.wrap} ${className}`}>
            <div className={style.main}>
                {children}
            </div>
        </section>
    )
}