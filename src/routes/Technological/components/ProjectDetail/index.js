import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import DetailInfo from './DetailInfo'
import CreateTask from  './CreateTask'

const getEffectOrReducerByName = name => `projectDetail/${name}`

const ProjectDetail = (props) => {
  const { dispatch, model, modal } = props
  const { datas:{ projectInfoDisplay, taskItemList } } = model
  console.log(taskItemList)
  const HeaderListProps = {
    modal,
    model,
  }
  const DetailInfoProps = {
    modal,
    model,
    showModal() {
      dispatch({ type: 'modal/showModal' })
    },
    hideModal() {
      dispatch({ type: 'modal/hideModal' })
    }
  }

  const CreateTaskProps = {
    modal,
    model,
    addTaskItem() {
      taskItemList.push({})
      dispatch({
        type: getEffectOrReducerByName('updateDatas'),
        payload: {
          taskItemList
        }
      })
    }
  }

  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route:path,
      },
    })
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }

  return(
    <div style={{ height: '100%' ,position: 'relative'}}>
      <Header {...HeaderListProps} routingJump={routingJump} updateDatas={updateDatas} />
      <DetailInfo {...DetailInfoProps} routingJump={routingJump} updateDatas={updateDatas} projectInfoDisplay={projectInfoDisplay}/>
      <CreateTask  {...CreateTaskProps}/>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, projectDetail, loading }) {
  return { modal, model: projectDetail, loading }
}
export default connect(mapStateToProps)(ProjectDetail)


