import React, { Component } from "react";
import { connect } from "dva";
import { Dropdown, Menu } from "antd";
import styles from "./index.less";
import ProjectListBarCell from "./ProjectListBarCell";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

class ProjectListBar extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.state = {
      dropDownMenuItemList: []
    };
  }
  handleClickProjectItem = id => {
    const { dispatch } = this.props;
    const { dropDownMenuItemList } = this.state;
    //如果是在下拉菜单中的元素，需要将元素置于数组的首位
    const isInDropDownMenuItemList = dropDownMenuItemList.find(
      item => item.board_id === id
    );
    Promise.resolve(
      dispatch({
        type: "workbench/handleCurrentSelectedProjectChange",
        payload: {
          board_id: id,
          shouldResortPosition: isInDropDownMenuItemList ? true : false
        }
      })
    ).then(() => {
      this.handleWinResize();
    });
  };
  onClick = ({ key }) => {
    const { projectTabCurrentSelectedProject } = this.props;
    if (key === projectTabCurrentSelectedProject) {
      return;
    }
    this.handleClickProjectItem(key);
  };
  handleClickedCell = id => {
    const { projectTabCurrentSelectedProject } = this.props;
    //如果重复点击
    if (id === projectTabCurrentSelectedProject) {
      return;
    }
    this.handleClickProjectItem(id);
  };
  componentDidMount() {
    this.handleWinResize();
    window.addEventListener("resize", this.handleWinResize, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWinResize, false);
  }
  handleWinResize = () => {
    const { projectList } = this.props;
    const listRefChildren = this.listRef.current.children;
    if (listRefChildren) {
      const childNodeOffsetTopList = [...listRefChildren].map(childNode => {
        return childNode.offsetTop;
      });
      const shouldPushInDropDownMenuItem = childNodeOffsetTopList.reduce(
        (acc, curr, ind) => {
          if (curr !== 0) {
            return [...acc, projectList[ind]];
          }
          return acc;
        },
        []
      );
      this.setState({
        dropDownMenuItemList: shouldPushInDropDownMenuItem
      });
    }
  };
  render() {
    const { projectList, projectTabCurrentSelectedProject } = this.props;
    const { dropDownMenuItemList } = this.state;
    let projectListBarAllClass = cx({
      [styles.projectListBarAll]: true,
      [styles.projectListBarCellActive]:
        projectTabCurrentSelectedProject === "0" ? true : false
    });
    const dropDownMenu = (
      <div className={styles.dropDownMenuWrapper}>
      <Menu onClick={this.onClick} style={{ minWidth: "120px" }}>
        {dropDownMenuItemList.map(item => (
          <Menu.Item key={item.board_id}>{item.board_name}</Menu.Item>
        ))}
      </Menu>
      </div>
    );
    return (
      <div className={styles.projectListBarWrapper}>
        {projectList && projectList.length !== 0 && (
          <p
            className={projectListBarAllClass}
            onClick={() => this.handleClickedCell("0")}
          >
            所有参与的项目
          </p>
        )}
        <ul className={styles.projectListBarItemWrapper} ref={this.listRef}>
          {projectList &&
            projectList.map(({ board_id, board_name }) => (
              <ProjectListBarCell
                board_id={board_id}
                board_name={board_name}
                key={board_id}
                handleClickedCell={this.handleClickedCell}
                shouldActive={projectTabCurrentSelectedProject}
              />
            ))}
        </ul>
        {dropDownMenuItemList.length === 0 ? null : (
          <Dropdown overlay={dropDownMenu} style={{ zIndex: "9999" }}>
            <div className={styles.projectListBarExpand}>
              <p className={styles.projectListBarExpandImg} />
            </div>
          </Dropdown>
        )}
      </div>
    );
  }
}

export default connect(
  ({
    workbench: {
      datas: { projectList, projectTabCurrentSelectedProject }
    }
  }) => ({
    projectList,
    projectTabCurrentSelectedProject
  })
)(ProjectListBar);
