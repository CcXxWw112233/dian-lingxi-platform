import React, { Component } from 'react';
import { Icon, message } from 'antd';
import styles from './ProjectItems.less';
import indexStyle from './index.less';
import { connect } from 'dva';
import {
  checkIsHasPermission,
  currentNounPlanFilterName
} from '../../../../utils/businessFunction';
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_TEAM_BOARD_CREATE,
  PROJECTS
} from '../../../../globalset/js/constant';
import AddModalForm from './AddModalForm';
import ElseProject from './ElseProject';

@connect(({ project }) => ({
  currentProjectGroupProjectList: project.datas.currentProjectGroupProjectList,
}))
class ProjectItems extends Component {
  addItem = (e) => {
    if(e) e.preventDefault()
    if (!checkIsHasPermission(ORG_TEAM_BOARD_CREATE)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
      return false;
    }
    this.props.showModal();
  };

  renderAddProject = () => {
    return (
      <a
        className={indexStyle.addListItem}
        style={{ marginTop: 0, width: '770px', display: 'inline-block'}}
        onClick={(e) => this.addItem(e)}
      >
        <Icon type="plus-circle-o" style={{ fontSize: 18, color: '#8c8c8c' }} />
      </a>
    );
  };
  renderProjectItem = () => {
    const { currentProjectGroupProjectList } = this.props;
    if (!currentProjectGroupProjectList) return null;
    return (
      <div className={indexStyle.projectListOut}>
        {currentProjectGroupProjectList.map(value => {
          const { is_star, board_id } = value;
          return <ElseProject {...this.props} key={`${board_id}_${is_star}`} itemDetailInfo={value} />;
        })}
      </div>
    );
  };
  render() {
    return (
      <div className={styles.wrapper}>
        {this.renderAddProject()}
        {this.renderProjectItem()}
        <AddModalForm {...this.props} />
      </div>
    );
  }
}

export default ProjectItems;
