import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import DropdownSelect from './Components/DropdownSelect/index'


const SimpleMode = (props) => {
  console.log("YING", props);

  return (
    <div className={indexStyles.topWapper}>
      <div className={indexStyles.miniNavigation}>
        <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe7f4;</i>
      </div>
      <div className={indexStyles.miniImMessage}>
        <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe8e8;</i>
      </div>

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
            <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_add}`} >&#xe8fe;</i>
          </div>

        </div>
      </div>
      <div className={indexStyles.wallpaperSelectWapper}>
        <div className={indexStyles.wallpaperSelector}>
          <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)',}}>&#xe7ec;</i>
          <i className={`${globalStyles.authTheme}`} style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 1)',marginLeft: '26px', marginRight: '26px'}}>&#xe631;</i>
          <i className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1)',}}>&#xe7eb;</i>
        </div>
      </div>
    </div>
  )

};

export default connect(({ }) => ({}))(SimpleMode)