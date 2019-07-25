import React, { Component } from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon } from 'antd';
import DropdownSelect from '../../Components/DropdownSelect/index'
import CreateProject from '@/routes/Technological/components/Project/components/CreateProject/index';
import simpleMode from "../../../../models/simpleMode";

class MyWorkbenchBoxs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addProjectModalVisible: false
    };
  }

  addMyWorkBoxs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        simpleHeaderVisiable: false,
        myWorkbenchBoxsVisiable: false,
        wallpaperSelectVisiable: false,
        workbenchBoxSelectVisiable: true,
        createProjectVisiable: false,
      }
    });
  }
  createNewBoard = (data) => {
    if (data.key === 'add') {
      console.log("createNewBoard");
      this.setState({
        addProjectModalVisible: true
      });
      return this.handleCreateProject();
    } else {

    }
    const { dispatch } = this.props;

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
    let menuItemList = [];
    projectList.map((board, index) => {
      const { board_id: id, board_name: name } = board
      menuItemList.push({ id, name });
    });
    return menuItemList;
  }

  goWorkbenchBox = ({ id, code }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'simplemode/routingJump',
      payload: {
        route: '/technological/simplemode/workbench?box=' + id
      }
    });

  }

  render() {
    const { project, projectList, projectTabCurrentSelectedProject, myWorkbenchBoxList = [] } = this.props;
    const { datas = {} } = project;
    const { appsList = [] } = datas;

    const { addProjectModalVisible = false } = this.state;
    const menuItemList = this.getMenuItemList(projectList);

    const fuctionMenuItemList = [{ 'name': '新建项目', 'icon': 'plus-circle', 'selectHandleFun': this.createNewBoard, 'id': 'add' }];

    return (
      <div className={indexStyles.mainContentWapper}>
        <div className={indexStyles.projectSelector}>
          <DropdownSelect itemList={menuItemList} fuctionMenuItemList={fuctionMenuItemList} menuItemClick={this.createNewBoard}></DropdownSelect>
        </div>
        <div className={indexStyles.myWorkbenchBoxWapper}>
          {
            myWorkbenchBoxList.map((item, key) => {
              return item.status == 1 ? (
                <div key={item.id} className={indexStyles.myWorkbenchBox} onClick={(e) => this.goWorkbenchBox(item) }>
                  <i dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} ></i><br />
                  <span className={indexStyles.myWorkbenchBox_title}>{item.name}</span>
                </div>
              ) : ''
            })
          }
          {/*          
          <div className={indexStyles.myWorkbenchBox} onClick={this.goWorkbenchBox}>
            <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe671;</i><br />
            <span className={indexStyles.myWorkbenchBox_title}>项目计划</span>
          </div>
          <div className={indexStyles.myWorkbenchBox} onClick={this.goWorkbenchBox}>
            <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe672;</i><br />
            <span className={indexStyles.myWorkbenchBox_title}>项目交流</span>
          </div>
          <div className={indexStyles.myWorkbenchBox}>
            <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} >&#xe673;</i><br />
            <span className={indexStyles.myWorkbenchBox_title}>项目文件</span>
          </div>
          */}
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
      workbenchBoxList
    }
    , project }) => ({
      project,
      projectList,
      projectTabCurrentSelectedProject,
      myWorkbenchBoxList,
      workbenchBoxList
    }))(MyWorkbenchBoxs)