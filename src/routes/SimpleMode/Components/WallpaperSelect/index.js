import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon } from 'antd';

const WallpaperSelect = (props) => {
    const { dispatch, wallpaperSelectModalVisiable } = props;
    const openWallpaper = () => {
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                simpleHeaderVisiable: true,
                myWorkbenchBoxsVisiable: true,
                wallpaperSelectVisiable: true,
                workbenchBoxSelectVisiable: false,
                createProjectVisiable: false,
                wallpaperSelectModalVisiable: true,
            }
        });
    }

    const closeWallpaper = () => {
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                simpleHeaderVisiable: true,
                myWorkbenchBoxsVisiable: true,
                wallpaperSelectVisiable: true,
                workbenchBoxSelectVisiable: false,
                createProjectVisiable: false,
                wallpaperSelectModalVisiable: false,
            }
        });
    }
    return (
        <div>
            {!wallpaperSelectModalVisiable && (
<div className={indexStyles.wallpaperSelectWapper}>
                    <div className={indexStyles.wallpaperSelector}>
                        <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', cursor: 'pointer' }}>&#xe7ec;</i>
                        <i className={`${globalStyles.authTheme}`} style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 1)', marginLeft: '26px', marginRight: '26px', cursor: 'pointer' }}
                            onClick={openWallpaper}>&#xe631;</i>
                        <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', cursor: 'pointer' }}>&#xe7eb;</i>
                    </div>
                </div>
)}

            {wallpaperSelectModalVisiable && (
<div className={indexStyles.wallpaperSelectModal}>
                    <div className={indexStyles.wallpaperBoxsTitle}>选择壁纸</div>
                    <div className={indexStyles.wallpaperBoxs}>
                        <div className={`${indexStyles.wallpaperItem}`}>
                            <div className={`${indexStyles.wallpaperItemCover} ${indexStyles.selected}`}>
                                <div className={indexStyles.wallpaperItemSelected_icon}><Icon type="check-circle" theme="filled" style={{ fontSize: '16px' }} /></div>
                            </div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>

                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>

                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                        <div className={indexStyles.wallpaperItem}>
                            <div className={indexStyles.wallpaperItemCover}></div>
                        </div>
                    </div>
                    <div className={indexStyles.close} onClick={closeWallpaper}>
                        <Icon type="close" style={{fontSize: '20px'}} />
                    </div>
                </div>
)}
        </div>
    );
}


export default connect(({ simplemode: { wallpaperSelectModalVisiable } }) => ({ wallpaperSelectModalVisiable }))(WallpaperSelect)