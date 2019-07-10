import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';
import DropdownSelect from '../../Components/DropdownSelect/index'

const MyWorkbenchBoxs = (props) => {
    return (
        <div className={indexStyles.mainContentWapper}>
            <div className={indexStyles.projectSelector}>
                <DropdownSelect></DropdownSelect>
            </div>
            <div className={indexStyles.myWorkbenchBoxWapper}>
                <div className={indexStyles.myWorkbenchBox}>
                    <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe670;</i><br />
                    <span className={indexStyles.myWorkbenchBox_title}>项目档案</span>

                </div>
                <div className={indexStyles.myWorkbenchBox}>
                    <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe671;</i><br />
                    <span className={indexStyles.myWorkbenchBox_title}>项目计划</span>
                </div>
                <div className={indexStyles.myWorkbenchBox}>
                    <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe672;</i><br />
                    <span className={indexStyles.myWorkbenchBox_title}>项目交流</span>
                </div>
                <div className={indexStyles.myWorkbenchBox}>
                    <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe673;</i><br />
                    <span className={indexStyles.myWorkbenchBox_title}>项目文件</span>
                </div>
                <div className={indexStyles.myWorkbenchBox}>
                    <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_add}`} >&#xe67e;</i>
                </div>

            </div>
        </div>

    );
}

export default connect(({ }) => ({}))(MyWorkbenchBoxs)