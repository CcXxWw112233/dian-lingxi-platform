import React from "react";
import dva, { connect } from "dva"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';

const SimpleHeader = (props) => {
    return (
        <div className={indexStyles.headerWapper}>
            <div className={indexStyles.miniNavigation}>
                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe7f4;</i>
            </div>
            <div className={indexStyles.miniImMessage}>
                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe8e8;</i>
            </div>
        </div>
    );
}
export default connect(({ }) => ({}))(SimpleHeader)