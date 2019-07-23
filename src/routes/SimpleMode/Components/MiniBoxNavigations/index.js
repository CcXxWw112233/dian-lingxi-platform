import React from 'react'
import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon, Divider, Tooltip } from 'antd';

const MiniBoxNavigations = (props) => {

    const goHome = () => {
        const { dispatch } =props;
        dispatch({
          type: 'simplemode/routingJump',
          payload: {
            route: '/technological/simplemode/home'
          }
        })
    };
    const { workbenchBoxContentWapperModalStyle } = props;
    return (
        <div className={indexStyles.workbenchboxsNavsModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
            <div className={indexStyles.boxnavsWapper}>
                <Tooltip placement="bottom" title='首页' className={`${indexStyles.nav} ${indexStyles.home}`} onClick={goHome}>
                    <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }} >&#xe66e;</i>
                </Tooltip>
                <Divider className={indexStyles.divider} type="vertical" />
                <Tooltip placement="bottom" title='项目交流' className={`${indexStyles.nav} ${indexStyles.menu}`}>
                    <div className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }}>&#xe683;</div>
                    <div className={indexStyles.text}>项目交流</div>
                </Tooltip>

                <Tooltip placement="bottom" title='项目交流' className={`${indexStyles.nav} ${indexStyles.menu} ${indexStyles.selected}`}>
                    <div className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }} >&#xe671;</div>
                    <div className={indexStyles.text}>项目计划</div>
                </Tooltip>
            </div>

        </div>
    )
}

export default connect(({ simplemode: { workbenchBoxContentWapperModalStyle } }) => ({ workbenchBoxContentWapperModalStyle }))(MiniBoxNavigations)

