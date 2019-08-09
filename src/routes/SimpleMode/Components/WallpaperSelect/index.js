import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon } from 'antd';
import React, { Component } from "react";

class WallpaperSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wallpaperSelectModalVisiable: false
        }
    }


    openWallpaper = () => {
        this.setState({
            wallpaperSelectModalVisiable: true,
        });
        this.props.setHomeVisible({
            simpleHeaderVisiable: true,
            myWorkbenchBoxsVisiable: true,
            wallpaperSelectVisiable: true,
            workbenchBoxSelectVisiable: false,
            createProjectVisiable: false,
        });
    }

    closeWallpaper = () => {

        this.setState({
            wallpaperSelectModalVisiable: false
        });
        this.props.setHomeVisible({
            simpleHeaderVisiable: true,
            myWorkbenchBoxsVisiable: true,
            wallpaperSelectVisiable: true,
            workbenchBoxSelectVisiable: false,
            createProjectVisiable: false,
        });
    }

    selectMyWallpaper = (wallpaperId, wallpaperUrl) => {
        const { dispatch } = this.props;
        //console.log(wallpaperUrl);
        this.setState({
            usersetWallpaperId: wallpaperId
        });
        dispatch({
            type: 'accountSet/updateUserSet',
            payload: {
                preference_wallpaper_id: wallpaperId
            }
        });
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                currentUserWallpaperUrl: wallpaperUrl
            }
        });
    }

    selectPreviousWallpaper = () => {
        //获取当前壁纸index
        const { allWallpaperList = [], currentUserWallpaperUrl, userInfo = {} } = this.props;
        const { wallpaper = '' } = userInfo;
        const wallpaperUrl = currentUserWallpaperUrl ? currentUserWallpaperUrl : wallpaper;
        if (allWallpaperList.length === 0) {
            return;
        }
        let currentIndex = allWallpaperList.findIndex((value) => value.url === wallpaperUrl);
        if (currentIndex === 0) {
            currentIndex = allWallpaperList.length - 1;
        } else {
            currentIndex = currentIndex - 1;
        }
        const currentWallpaper = allWallpaperList[currentIndex];
        if (currentWallpaper) {
            this.selectMyWallpaper(currentWallpaper.id, currentWallpaper.url);
        }

        console.log("上一张")
    }

    selectNextWallpaper = () => {
        //获取当前壁纸index
        const { allWallpaperList = [], currentUserWallpaperUrl, userInfo = {} } = this.props;
        const { wallpaper = '' } = userInfo;
        const wallpaperUrl = currentUserWallpaperUrl ? currentUserWallpaperUrl : wallpaper;
        if (allWallpaperList.length === 0) {
            return;
        }
        let currentIndex = allWallpaperList.findIndex((value) => value.url === wallpaperUrl);
        if (currentIndex === allWallpaperList.length - 1) {
            currentIndex = -0;
        } else {
            currentIndex = currentIndex + 1;
        }
        const currentWallpaper = allWallpaperList[currentIndex];
        if (currentWallpaper) {
            this.selectMyWallpaper(currentWallpaper.id, currentWallpaper.url);
        }

        console.log("下一张")
    }
    render() {
        const { wallpaperSelectModalVisiable } = this.state;
        const { allWallpaperList = [], currentUserWallpaperUrl, userInfo = {} } = this.props;
        const { wallpaper = '' } = userInfo;
        const wallpaperUrl = currentUserWallpaperUrl ? currentUserWallpaperUrl : wallpaper;

        return (
            <div>
                {!wallpaperSelectModalVisiable && (
                    <div className={indexStyles.wallpaperSelectWapper}>
                        <div className={indexStyles.wallpaperSelector}>
                            <i title={'上一页壁纸'} onClick={this.selectPreviousWallpaper} className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', cursor: 'pointer' }}>&#xe7ec;</i>
                            <i className={`${globalStyles.authTheme}`} style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 1)', marginLeft: '26px', marginRight: '26px', cursor: 'pointer' }}
                                onClick={this.openWallpaper}>&#xe631;</i>
                            <i title={'下一页壁纸'} onClick={this.selectNextWallpaper} className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)', cursor: 'pointer' }}>&#xe7eb;</i>
                        </div>
                    </div>
                )}

                {wallpaperSelectModalVisiable && (
                    <div className={indexStyles.wallpaperSelectModal}>
                        <div className={indexStyles.wallpaperBoxsTitle}>选择壁纸</div>
                        <div className={indexStyles.wallpaperBoxs}>
                            {
                                allWallpaperList.map((wallpaperItem, index) => {
                                    return (
                                        <div id={wallpaperItem.id} key={wallpaperItem.id} className={`${indexStyles.wallpaperItem}`} style={{ backgroundImage: `url(${wallpaperItem.url})` }} onClick={e => this.selectMyWallpaper(wallpaperItem.id, wallpaperItem.url)}>

                                            <div className={`${indexStyles.wallpaperItemCover} ${wallpaperUrl === wallpaperItem.url ? indexStyles.selected : ''}`}>
                                                {
                                                    wallpaperUrl === wallpaperItem.url &&
                                                    <div className={indexStyles.wallpaperItemSelected_icon}><Icon type="check-circle" theme="filled" style={{ fontSize: '16px' }} /></div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={indexStyles.close} onClick={this.closeWallpaper}>
                            <Icon type="close" style={{ fontSize: '20px' }} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}



export default connect(({
    simplemode: { wallpaperSelectModalVisiable, allWallpaperList, currentUserWallpaperUrl },
    technological: {
        datas: { userInfo }
    }
}) => ({ wallpaperSelectModalVisiable, allWallpaperList, currentUserWallpaperUrl, userInfo }))(WallpaperSelect)