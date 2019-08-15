import React, { Component } from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon, message, Tooltip } from 'antd';
import DropdownSelect from '../../Components/DropdownSelect/index'
import CreateProject from '@/routes/Technological/components/Project/components/CreateProject/index';
import simpleMode from "../../../../models/simpleMode";
import { getOrgNameWithOrgIdFilter, setBoardIdStorage } from "@/utils/businessFunction"

class MyWorkbenchBoxs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addProjectModalVisible: false
    };
  }

  componentWillMount() {


  }

  componentWillReceiveProps(nextProps) {
    const { projectList: old_projectList } = this.props;
    const { dispatch, projectList } = nextProps;
    if ((!old_projectList || old_projectList.length == 0) && projectList.length > 0) {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
      const { user_set = {} } = userInfo
      console.log(user_set);
      console.log(projectList);
      const selectBoard = projectList.filter(item => item.board_id === user_set.current_board);
      console.log("selectBoard",selectBoard);
      
      if (selectBoard && selectBoard.length >0) {
       //设置当前选中的项目
       setBoardIdStorage(user_set.current_board);
       dispatch({
         type: 'simplemode/updateDatas',
         payload: {
           simplemodeCurrentProject: { ...selectBoard[0] }
         }
       });
      }
    }


  }

  addMyWorkBoxs = () => {
    this.props.setHomeVisible({
      simpleHeaderVisiable: false,
      myWorkbenchBoxsVisiable: false,
      wallpaperSelectVisiable: false,
      workbenchBoxSelectVisiable: true,
      createProjectVisiable: false,
    });
  }
  onSelectBoard = (data) => {
    console.log(data, 'bbbbb');
    if (data.key === 'add') {
      //console.log("onSelectBoard");
      this.setState({
        addProjectModalVisible: true
      });
      return this.handleCreateProject();
    } else {
      const { dispatch, projectList } = this.props;
      if (data.key === 0) {
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {}
          }
        });
        dispatch({
          type: 'accountSet/updateUserSet',
          payload: {
            current_board: {}
          }
        });
      } else {
        const selectBoard = projectList.filter(item => item.board_id === data.key);
        if (!selectBoard && selectBoard.length == 0) {
          message.error('数据异常，请刷新后重试');
          return;
        }
        //设置当前选中的项目
        setBoardIdStorage(data.key);
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: { ...selectBoard[0] }
          }
        });

        dispatch({
          type: 'accountSet/updateUserSet',
          payload: {
            current_board: data.key
          }
        });
      }


    }

  }

  handleCreateProject = () => {
    this.setAddProjectModalVisible()
  };


  setAddProjectModalVisible = () => {
    const { dispatch } = this.props
    const { addProjectModalVisible } = this.state
    this.setState({
      addProjectModalVisible: !addProjectModalVisible
    }, () => {
      if (!addProjectModalVisible) {
        dispatch({
          type: 'project/getAppsList',
          payload: {
            type: '2'
          }
        });
      }
    })
  }

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
        this.setAddProjectModalVisible();
      });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/getProjectList',
      payload: {}
    })
  }

  getMenuItemList(projectList) {
    const { currentUserOrganizes } = this.props;
    let menuItemList = [{ id: '0', name: '我参与的项目' }];
    projectList.map((board, index) => {
      const { board_id: id, board_name: name, org_id } = board
      menuItemList.push({ id, name, parentName: getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes) });
    });

    return menuItemList;
  }

  goWorkbenchBox = ({ id, code, status }) => {
    if (status == 0) {
      message.warn("功能开发中，请耐心等待");
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        currentSelectedWorkbenchBox: { id, code }
      }
    });
    dispatch({
      type: 'simplemode/routingJump',
      payload: {
        route: '/technological/simplemode/workbench'
      }
    });


  }

  renderBoxItem = (item) => {
    return (
      <div key={item.id} className={indexStyles.myWorkbenchBox} onClick={(e) => this.goWorkbenchBox(item)} disabled={item.status == 0 ? true : false}>
        <i dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} ></i><br />
        <span className={indexStyles.myWorkbenchBox_title}>{item.name}</span>
      </div>
    );
  }

  render() {
    const { project, projectList, projectTabCurrentSelectedProject, myWorkbenchBoxList = [], simplemodeCurrentProject = {} } = this.props;
    const { datas = {} } = project;
    const { appsList = [] } = datas;

    const { addProjectModalVisible = false } = this.state;
    console.log(projectList, "ppppppp");
    const menuItemList = this.getMenuItemList(projectList);
    const fuctionMenuItemList = [{ 'name': '新建项目', 'icon': 'plus-circle', 'selectHandleFun': this.createNewBoard, 'id': 'add' }];
    let selectedKeys = ['0'];
    if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
      selectedKeys = [simplemodeCurrentProject.board_id]
    }
    return (
      <div className={indexStyles.mainContentWapper}>

        <div className={indexStyles.projectSelector}>
          <DropdownSelect selectedKeys={selectedKeys} iconVisible={true} simplemodeCurrentProject={simplemodeCurrentProject} itemList={menuItemList} fuctionMenuItemList={fuctionMenuItemList} menuItemClick={this.onSelectBoard}></DropdownSelect>
        </div>

        <div className={indexStyles.myWorkbenchBoxWapper}>
          {
            myWorkbenchBoxList.map((item, key) => {
              return (
                item.status == 0 ? (
                  <Tooltip title="功能开发中，请耐心等待">
                    {this.renderBoxItem(item)}
                  </Tooltip>
                ) :
                  this.renderBoxItem(item)
              )
            })
          }
          <div className={indexStyles.myWorkbenchBox} onClick={this.addMyWorkBoxs}>
            <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_add}`} >&#xe67e;</i>
          </div>
        </div>

        {addProjectModalVisible && (
          <CreateProject
            setAddProjectModalVisible={this.setAddProjectModalVisible}
            addProjectModalVisible={addProjectModalVisible}
            appsList={appsList}
            addNewProject={this.handleSubmitNewProject}
          />
        )}
      </div>

    );
  }
}

export default connect(
  ({
    workbench: {
      datas: { projectList, projectTabCurrentSelectedProject } }
    ,
    simplemode: {
      myWorkbenchBoxList,
      workbenchBoxList,
      simplemodeCurrentProject
    },
    technological: {
      datas: { currentUserOrganizes }
    }
    , project }) => ({
      project,
      projectList,
      projectTabCurrentSelectedProject,
      myWorkbenchBoxList,
      workbenchBoxList,
      currentUserOrganizes,
      simplemodeCurrentProject
    }))(MyWorkbenchBoxs)