import React, { Component } from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, message } from 'antd';
import styles from './index.less';
import ProjectListBarCell from './ProjectListBarCell';
import classNames from 'classnames/bind';
import AddModalFormWithExplicitProps from './../Project/AddModalFormWithExplicitProps';
import { checkIsHasPermission } from './../../../../utils/businessFunction';
import { ORG_TEAM_BOARD_CREATE } from './../../../../globalset/js/constant';

let cx = classNames.bind(styles);

class ProjectListBar extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.state = {
      dropDownMenuItemList: [],
      addNewProjectModalVisible: false
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
        type: 'workbench/handleCurrentSelectedProjectChange',
        payload: {
          board_id: id,
          shouldResortPosition: isInDropDownMenuItemList ? true : false
        }
      })
    ).then(() => {
      this.handleWinResize();
    });
  };
  handleCreateNewProject = e => {
    if (e) e.stopPropagation();
    return this.handleCreateProject();
  };
  onClick = ({ key }) => {
    const { projectTabCurrentSelectedProject } = this.props;
    //如果重复点击 projectItem
    if (key === projectTabCurrentSelectedProject) {
      return;
    }

    //如果是点击新建项目
    if (key === 'create_project') {
      return this.handleCreateProject();
    }
    this.handleClickProjectItem(key);
  };
  handleCreateProject = () => {
    this.showModal()
  };
  getUerInfoFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (err) {
      return {};
    }
  };
  hideModal = () => {
    this.setState({
      addNewProjectModalVisible: false
    });
  };
  showModal = () => {
    const { dispatch } = this.props;
    this.setState(
      {
        addNewProjectModalVisible: true
      },
      () => {
        dispatch({
          type: 'project/getAppsList',
          payload: {
            type: '2'
          }
        });
      }
    );
  };
  handleSubmitNewProject = data => {
    const { dispatch } = this.props;
    Promise.resolve(
      dispatch({
        type: 'project/addNewProject',
        payload: data
      })
    )
      .then(() => {
        dispatch({
          type: 'workbench/getProjectList',
          payload: {}
        });
      })
      .then(() => {
        this.hideModal();
      });
  };
  isVisitor = param => {
    //是否访客 1不是 0是
    const condMap = new Map([['0', true], ['1', false]]);
    if (typeof condMap.get(param) === 'undefined') return false;
    return condMap.get(param);
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
    window.addEventListener('resize', this.handleWinResize, false);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWinResize, false);
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
    const { project, projectList, projectTabCurrentSelectedProject } = this.props;
    const { dropDownMenuItemList, addNewProjectModalVisible } = this.state;
    let projectListBarAllClass = cx({
      [styles.projectListBarAll]: true,
      [styles.projectListBarCellActive]:
        projectTabCurrentSelectedProject === '0' ? true : false
    });
    const {
      current_org: { identity_type } = {}
    } = this.getUerInfoFromLocalStorage() ? this.getUerInfoFromLocalStorage() : {};
    const isVisitor = this.isVisitor(identity_type);
    const dropDownMenu = (
      <div className={styles.dropDownMenuWrapper}>
        <Menu onClick={this.onClick} style={{ minWidth: '120px' }}>
          {dropDownMenuItemList.map(item => (
            <Menu.Item key={item.board_id}><span style={{userSelect: 'none'}}>{item.board_name}</span></Menu.Item>
          ))}
          {!isVisitor && checkIsHasPermission(ORG_TEAM_BOARD_CREATE) && <Menu.Item key='create_project'><span style={{userSelect: 'none'}}>新建项目</span></Menu.Item>}
        </Menu>
      </div>
    );
    const dropDownMenuCreateProject = (
      <div className={styles.dropDownMenuWrapper}>
        <p
          className={styles.dropDownMenuItem__createProject}
          onClick={e => this.handleCreateNewProject(e)}
        >
          新建项目
        </p>
      </div>
    );
    return (
      <div className={styles.projectListBarWrapper}>
        {projectList && projectList.length !== 0 && (
          <p
            className={projectListBarAllClass}
            onClick={() => this.handleClickedCell('0')}
          >
            所有参与的项目
          </p>
        )}
        <ul className={styles.projectListBarItemWrapper} ref={this.listRef}>
          {projectList &&
            projectList.map(({ board_id, board_name, apps }) => (
              <ProjectListBarCell
                board_id={board_id}
                board_name={board_name}
                key={board_id}
                apps={apps}
                handleClickedCell={this.handleClickedCell}
                shouldActive={projectTabCurrentSelectedProject}
              />
            ))}
        </ul>
        {dropDownMenuItemList.length === 0 ? (
         projectList.length && !isVisitor && checkIsHasPermission(ORG_TEAM_BOARD_CREATE) ? (
            <Dropdown
              overlay={dropDownMenuCreateProject}
              style={{ zIndex: '9999' }}
            >
              <div className={styles.projectListBarCreateNewProject}>
                <p className={styles.projectListBarExpandImg} />
              </div>
            </Dropdown>
          ) : null
        ) : (
          <Dropdown overlay={dropDownMenu} style={{ zIndex: '9999' }}>
            <div className={styles.projectListBarExpand}>
              <p className={styles.projectListBarExpandImg} />
            </div>
          </Dropdown>
        )}
        {addNewProjectModalVisible && (
          <AddModalFormWithExplicitProps
            addNewProjectModalVisible={addNewProjectModalVisible}
            key="1"
            hideModal={this.hideModal}
            showModal={this.showModal}
            project={project}
            handleSubmitNewProject={this.handleSubmitNewProject}
          />
        )}
      </div>
    );
  }
}

export default connect(
  ({
    workbench: {
      datas: { projectList, projectTabCurrentSelectedProject }
    },
    project
  }) => ({
    project,
    projectList,
    projectTabCurrentSelectedProject
  })
)(ProjectListBar);
