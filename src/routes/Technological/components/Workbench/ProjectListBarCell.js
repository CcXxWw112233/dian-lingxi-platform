import React from "react";
import { Tooltip } from "antd";
import styles from "./index.less";
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

const ProjectListBarCell = ({
  board_id,
  board_name,
  handleClickedCell,
  org_name,
  shouldActive
}) => {
  const projectListBarCellClass = cx({
    [styles.projectListBarCellWrapper]: true,
    [styles.projectListBarCellActive]: shouldActive === board_id ? true : false
  })
  const handleClickedCell_ = (e, board_id) => {
    if(e) e.stopPropagation()
    handleClickedCell(board_id)
  }
  return (
    <li
      className={projectListBarCellClass}
      onClick={(e) => handleClickedCell_(e, board_id)}
    >
      <Tooltip title={org_name ? board_name + " #" + org_name : board_name}>
        <a className={styles.projectListBarCellContent}>
          <span>{board_name}</span>
          {org_name && `#${org_name}`}
        </a>
      </Tooltip>
    </li>
  );
};

export default ProjectListBarCell;
