import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';

const WorkbenchBoxSelect = (props) => {
  const { dispatch, workbenchBoxList = [], myWorkbenchBoxList = [] } = props;
  const closeBoxManage = (e) => {
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        simpleHeaderVisiable: true,
        myWorkbenchBoxsVisiable: true,
        wallpaperSelectVisiable: true,
        workbenchBoxSelectVisiable: false,
        createProjectVisiable: false,
      }
    });
  }
  const selectOrCancelCurrWorkbenchBox = (e, data) => {
    e.stopPropagation();
    const { id } = data;
    if (!data.isSelected) {
      dispatch({
        type: 'simplemode/myboxSet',
        payload: { id }
      });
    } else {
      dispatch({
        type: 'simplemode/myboxCancel',
        payload: { id }
      });
    }

  }
  //console.log("workbenchBoxList", workbenchBoxList);

  return (
    <div onClick={(e) => { closeBoxManage(e) }}>
      <div className={indexStyles.selectWorkbenchBoxWapperModalBg}></div>
      <div className={indexStyles.selectWorkbenchBoxWapperModal}>
        <div className={indexStyles.workbenchBoxWapper}>
          {
            workbenchBoxList.map((boxItem, key) => {
              let isSelected = myWorkbenchBoxList.filter(item => item.id === boxItem.id).length > 0 ? true : false;
              return (
                <div key={boxItem.id} className={indexStyles.workbenchBox} onClick={(e) => { selectOrCancelCurrWorkbenchBox(e, { id: boxItem.id, isSelected: isSelected }) }} >
                  <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe670;</i><br />
                  <span className={indexStyles.workbenchBox_title}>{boxItem.name}</span>
                  {isSelected &&
                    <span>
                      <div className={indexStyles.workbenchBoxSelected}><Icon type="check-circle" theme="filled" style={{ fontSize: '24px' }} /></div>
                      <div className={indexStyles.workbenchBoxSelectedBg}></div>
                    </span>
                  }

                </div>
              )
            })
          }

          {/* <div className={indexStyles.workbenchBox} onClick={(e) => { selectOrCancelCurrWorkbenchBox(e, {}) }} >
            <i className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} >&#xe670;</i><br />
            <span className={indexStyles.workbenchBox_title}>项目档案</span>
            <div className={indexStyles.workbenchBoxSelected}><Icon type="check-circle" theme="filled" style={{ fontSize: '24px' }} /></div>
            <div className={indexStyles.workbenchBoxSelectedBg}></div>
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
          </div> */}

        </div>

      </div>
    </div>
  );
}
export default connect(({ simplemode: { workbenchBoxList, myWorkbenchBoxList } }) => ({ workbenchBoxList, myWorkbenchBoxList }))(WorkbenchBoxSelect)