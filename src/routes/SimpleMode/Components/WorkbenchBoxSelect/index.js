import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';

const WorkbenchBoxSelect = (props) => {

    return(
        <div>
        <div className={indexStyles.selectWorkbenchBoxWapperModelBg}></div>
        <div className={indexStyles.selectWorkbenchBoxWapperModel}>
          <div className={indexStyles.workbenchBoxWapper}>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe670;</i><br />
              <span className={indexStyles.workbenchBox_title}>项目档案</span>
              <div className={indexStyles.workbenchBoxSelected}>
                <Icon type="check-circle" theme="filled" style={{fontSize:'22px'}} />
              </div>
              <div className={indexStyles.workbenchBoxSelectedBg}>
              </div>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe671;</i><br />
              <span className={indexStyles.workbenchBox_title}>项目计划</span>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe672;</i><br />
              <span className={indexStyles.workbenchBox_title}>项目交流</span>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe673;</i><br />
              <span className={indexStyles.workbenchBox_title}>项目文件</span>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe670;</i><br />
              <span className={indexStyles.workbenchBox_title}>我的展示</span>

            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe671;</i><br />
              <span className={indexStyles.workbenchBox_title}>我的任务</span>
            </div>
    
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe671;</i><br />
              <span className={indexStyles.workbenchBox_title}>我的流程</span>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe672;</i><br />
              <span className={indexStyles.workbenchBox_title}>投资地图</span>
              <div className={indexStyles.workbenchBoxSelectCircleHover}></div>
            </div>
            <div className={indexStyles.workbenchBox}>
              <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe673;</i><br />
              <span className={indexStyles.workbenchBox_title}>优秀案例</span>
              <div className={indexStyles.workbenchBoxSelectHover}></div>
            </div>
           
          </div>

        </div>
      </div>
    );
}
export default connect(({ }) => ({}))(WorkbenchBoxSelect)