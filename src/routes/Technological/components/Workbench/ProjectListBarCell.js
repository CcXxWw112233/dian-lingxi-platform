import React from "react";
import { Tooltip, message } from "antd";
import styles from "./index.less";
import globalStyles from './../../../../globalset/css/globalClassName.less';
import classNames from 'classnames/bind'


let cx = classNames.bind(styles)

const ProjectListBarCell = ({
  board_id,
  board_name,
  handleClickedCell,
  org_name,
  shouldActive,
  apps
}) => {
  const projectListBarCellClass = cx({
    [styles.projectListBarCellWrapper]: true,
    [styles.projectListBarCellActive]: shouldActive === board_id ? true : false
  })
  const handleClickedCell_ = (e, board_id) => {
    if(e) e.stopPropagation()
    handleClickedCell(board_id)
  }
  const promptWhenNoAppsItem = () => {
    const noAppsPromptText = '当前项目没有开启任何功能'
    message.error(noAppsPromptText)
  }
  const jumpToProject = (board_id, apps = []) => {
    // console.log(location.origin, 'location.origin')
    const getAppKey = apps => apps.find(item => item.unique_key === '3' ) ? '3' : apps[0]['unique_key']
    const url = `/#/technological/projectDetail?board_id=${board_id}&appsSelectKey=${getAppKey(apps)}`
    window.location.href = url

  }
  const handleJumpToProject = (e, board_id, apps) => {
    if(e) e.stopPropagation()
    const isAppsItem = arr => Array.isArray(arr) && arr.length
    if(!isAppsItem(apps)) {
      promptWhenNoAppsItem()
      return
    }
    return jumpToProject(board_id, apps)
  }

  return (
    <li
      className={projectListBarCellClass}
      onClick={(e) => handleClickedCell_(e, board_id)}
    >
      <Tooltip title={org_name ? board_name + " #" + org_name : board_name} placement='topLeft'>
        <a className={styles.projectListBarCellContent}>
          <span>{board_name}</span>
          {org_name && `#${org_name}`}
        </a>
      </Tooltip>
      <Tooltip title='进入项目'>
        <span className={styles.projectListBarCellInterProject} onClick={e => handleJumpToProject(e, board_id, apps)}>
        <i className={`${globalStyles.authTheme}`}>
        &#xe793;
      </i>
        </span>
      </Tooltip>
    </li>
  );
};

export default ProjectListBarCell;
