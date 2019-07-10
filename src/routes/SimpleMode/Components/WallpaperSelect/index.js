import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon } from 'antd';

const WallpaperSelect = () => {
    return (
        <div className={indexStyles.wallpaperSelectWapper}>
            <div className={indexStyles.wallpaperSelector}>
                <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', }}>&#xe7ec;</i>
                <i className={`${globalStyles.authTheme}`} style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 1)', marginLeft: '26px', marginRight: '26px' }}>&#xe631;</i>
                <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', }}>&#xe7eb;</i>
            </div>
        </div>
    );
}

export default connect(({ }) => ({}))(WallpaperSelect)