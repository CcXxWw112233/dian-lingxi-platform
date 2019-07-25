import React from 'react'
import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon, Divider, Tooltip, message } from 'antd';
import { MESSAGE_DURATION_TIME } from "@/globalset/js/constant";

const MiniBoxNavigations = (props) => {
    const { dispatch, myWorkbenchBoxList = [], workbenchBoxContentWapperModalStyle, currentSelectedWorkbenchBoxId = 0 } = props;

    const goHome = () => {
        dispatch({
            type: 'simplemode/routingJump',
            payload: {
                route: '/technological/simplemode/home'
            }
        })
    };
    if (!myWorkbenchBoxList || myWorkbenchBoxList.lenght == 0) {
        message.warn("没有获取到您所选的工作台功能模块", MESSAGE_DURATION_TIME)
        setTimeout(() => {
            goHome();
        }, 2000);
        return null;
    }
    return (
        <div className={indexStyles.workbenchboxsNavsModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
            <div className={indexStyles.boxnavsWapper}>
                <Tooltip placement="bottom" title='首页' className={`${indexStyles.nav} ${indexStyles.home}`} onClick={goHome}>
                    <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }} >&#xe66e;</i>
                </Tooltip>
                <Divider className={indexStyles.divider} type="vertical" />
                {
                    myWorkbenchBoxList.map((item, key) => {
                        return (
                            <Tooltip key={item.id} placement="bottom" title={item.name} className={`${indexStyles.nav} ${indexStyles.menu} ${currentSelectedWorkbenchBoxId == item.id ? indexStyles.selected : ''}`}>
                                <div dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }}></div>
                                <div className={indexStyles.text}>{item.name}</div>
                            </Tooltip>
                        )
                    })
                }



                {/* <Tooltip placement="bottom" title='项目交流' className={`${indexStyles.nav} ${indexStyles.menu} ${indexStyles.selected}`}>
                    <div className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }} >&#xe671;</div>
                    <div className={indexStyles.text}>项目计划</div>
                </Tooltip> */}
            </div>

        </div>
    )
}

export default connect(({ simplemode: {
    workbenchBoxContentWapperModalStyle,
    myWorkbenchBoxList

} }) => ({
    workbenchBoxContentWapperModalStyle,
    myWorkbenchBoxList

}))(MiniBoxNavigations)

