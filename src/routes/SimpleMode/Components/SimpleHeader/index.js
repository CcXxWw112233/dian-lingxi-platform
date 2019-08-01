import React from "react";
import dva, { connect } from "dva"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import SiderLeft from '@/routes/Technological/Sider/SiderLeft'
import VideoMeeting from '@/routes/Technological/Sider/comonent/videoMeetingPopoverContent/index'
import { Icon } from 'antd';

const SimpleHeader = (props) => {

    const { dispatch } = props;
    const openOrCloseImChatModal = () => {
        const width = document.body.scrollWidth;
        let workbenchBoxContentWapperModalStyle = {};
        if (!chatImVisiable) {
            workbenchBoxContentWapperModalStyle = { width: (width - 372) + 'px' }
        } else {
            workbenchBoxContentWapperModalStyle = { width: '100%' }
        }
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                chatImVisiable: !chatImVisiable,
                workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
            }
        });

    }
    const OpenOrCloseMainNav = () => {
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                leftMainNavVisible: !leftMainNavVisible
            }
        });

    }

    const { chatImVisiable = false, leftMainNavVisible = false } = props;
    return (
        <div className={indexStyles.headerWapper}>
            <div className={indexStyles.miniNavigation} onClick={OpenOrCloseMainNav}>
                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe7f4;</i>
            </div>
            <div className={indexStyles.miniImMessage} onClick={openOrCloseImChatModal}>
                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe8e8;</i>
            </div>
            {leftMainNavVisible &&
                <SiderLeft />
            }
            {chatImVisiable && (
                <div className={indexStyles.chatWapper}>
                    <div className={indexStyles.chatHeader}>
                        <div className={indexStyles.menu} onClick={openOrCloseImChatModal}>
                            <i className={`${globalStyles.authTheme}`} style={{ color: '#1890FF', fontSize: '24px' }}>&#xe7f4;</i>
                        </div>
                    </div>
                    {/* <SiderRight outInputSiderRightStyle={{ position: "absolute", top: 0, right: 0 }} collapsed={true} /> */}
                    <div className={indexStyles.imWapper}>
                        <iframe src='/im/index.html'></iframe>
                    </div>
                    <div className={indexStyles.videoMeetingWapper}>
                        <VideoMeeting />
                    </div>
                </div>
            )}

        </div>
    );
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ simplemode: { chatImVisiable, leftMainNavVisible }, modal, technological, loading }) {
    return { chatImVisiable, leftMainNavVisible, modal, model: technological, loading }
}
export default connect(mapStateToProps)(SimpleHeader)