import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

const Index = (props) => {
    const { is_realize, styles = {} } = props
    const checkClick = (e) => {
        // e.stopPropagation()
    }
    return (
        <div
            className={`${indexStyles.out}`}
            onMouseDown={(e) => e.preventDefault()}
            onMouseMove={(e) => e.preventDefault()}
            onMouseOver={(e) => e.preventDefault()}
            style={{...styles}}
            onClick={checkClick}>
               {
                   is_realize == '1'? (
                    <i className={`${globalStyles.authTheme}`}>&#xe662;</i>
                   ) : (
                    <i className={`${globalStyles.authTheme}`}>&#xe661;</i>
                   )
               } 
        </div>
    )
}

export default Index


