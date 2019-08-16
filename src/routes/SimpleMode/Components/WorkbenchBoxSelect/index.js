import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';

const WorkbenchBoxSelect = (props) => {
  const { dispatch, workbenchBoxList = [], myWorkbenchBoxList = [] } = props;
  const closeBoxManage =() => {
    props.setHomeVisible({
      simpleHeaderVisiable: true,
      myWorkbenchBoxsVisiable: true,
      wallpaperSelectVisiable: true,
      workbenchBoxSelectVisiable: false,
      createProjectVisiable: false,
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

  return (
    <div onClick={(e) => { closeBoxManage(e) }}>
      <div className={indexStyles.selectWorkbenchBoxWapperModalBg}></div>
      <div className={indexStyles.selectWorkbenchBoxWapperModal}>
        <div className={indexStyles.workbenchBoxWapper}>
          {
            workbenchBoxList.map((boxItem, key) => {
              let isSelected = myWorkbenchBoxList.filter(item => item.id == boxItem.id).length > 0 ? true : false;
              return boxItem.status == 1 ? (
                <div key={boxItem.id} className={indexStyles.workbenchBox} onClick={(e) => { selectOrCancelCurrWorkbenchBox(e, { id: boxItem.id, isSelected: isSelected }) }} >
                  <i dangerouslySetInnerHTML={{ __html: boxItem.icon }} className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} ></i><br />
                  <span className={indexStyles.workbenchBox_title}>{boxItem.name}</span>
                  {isSelected && (
<span>
                      <div className={indexStyles.workbenchBoxSelected}><Icon type="check-circle" theme="filled" style={{ fontSize: '24px' }} /></div>
                      <div className={indexStyles.workbenchBoxSelectedBg}></div>
                    </span>
)}

                  {!isSelected &&
                    <div className={indexStyles.workbenchBoxSelectHover}></div>
                  }

                </div>
) : '';
            })
          }
        </div>

      </div>
    </div>
  );
}
export default connect(({ simplemode: { workbenchBoxList, myWorkbenchBoxList } }) => ({ workbenchBoxList, myWorkbenchBoxList }))(WorkbenchBoxSelect)