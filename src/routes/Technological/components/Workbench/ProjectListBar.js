import React, { Component } from "react";
import { connect } from "dva";
import {Dropdown, Menu} from 'antd'
import styles from "./index.less";
import ProjectListBarCell from "./ProjectListBarCell";
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

const ProjectListBar = ({ projectList, projectTabCurrentSelectedProject, dispatch }) => {
  const handleClickProjectItem = (id) => {
    console.log(id, 'ididsididididdididididi')
    dispatch({
      type: 'workbench/handleCurrentSelectedProjectChange',
      payload: {
        board_id: id
      }
    })
  }
  const handleClickedCell = (id) => {
    //如果重复点击
    if(id === projectTabCurrentSelectedProject) {
      return
    }
    handleClickProjectItem(id)
  };
  // const projectListIdList = projectList.map(item => item.board_id);
  const onClick = ({key}) => {
    if(key === projectTabCurrentSelectedProject){
      return
    }
    handleClickProjectItem(key)
  }
  const dropDownMenu = (
    <Menu onClick={onClick}>
      <Menu.Item key='0'>
        所有参与的项目
      </Menu.Item>
      {projectList.map(item => (<Menu.Item key={item.board_id}>{item.board_name}</Menu.Item>))}
    </Menu>
  )
  let projectListBarAllClass = cx({
    [styles.projectListBarAll]: true,
    [styles.projectListBarCellActive]: projectTabCurrentSelectedProject === '0' ? true : false
  })
  return (
    <div className={styles.projectListBarWrapper}>
      <p className={projectListBarAllClass} onClick={() => handleClickedCell('0')}>所有参与的项目</p>
      {projectList &&
        projectList.map(({ board_id, board_name }) => (
          <ProjectListBarCell
            board_id={board_id}
            board_name={board_name}
            key={board_id}
            handleClickedCell={handleClickedCell}
            shouldActive={projectTabCurrentSelectedProject}
          />
        ))}
      <Dropdown overlay={dropDownMenu}>
      <div className={styles.projectListBarExpand}>
          <p className={styles.projectListBarExpandImg}></p>
      </div>
      </Dropdown>
    </div>
  );
};

export default connect(({ workbench: { datas: { projectList, projectTabCurrentSelectedProject } } }) => ({
  projectList,
  projectTabCurrentSelectedProject
}))(ProjectListBar);
