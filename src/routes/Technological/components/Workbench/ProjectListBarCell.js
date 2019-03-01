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
  return (
    <div
      className={projectListBarCellClass}
      onClick={() => handleClickedCell(board_id)}
    >
      <Tooltip title={org_name ? board_name + " #" + org_name : board_name}>
        <p className={styles.projectListBarCellContent}>
          <span>{board_name}</span>
          {org_name && `#${org_name}`}
        </p>
      </Tooltip>
    </div>
  );
};

export default ProjectListBarCell;
