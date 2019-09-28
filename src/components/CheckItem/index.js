import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

const Index = (props) => {
    const { is_realize } = props
    const checkClick = (e) => {
        e.stopPropagation()
    }
    return (
        <div
            className={`${indexStyles.out}`}
            onMouseDown={checkClick}
            onMouseOver={checkClick}
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


