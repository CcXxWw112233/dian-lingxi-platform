import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import EditTeamShowContent from './EditTeamShowContent'
import Header from './Header'

const getEffectOrReducerByName = name => `editTeamShow/${name}`

const EditTeamShow = (props) => {
  const { dispatch, model, modal } = props

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
  const EditTeamShowContentProps = {
    modal,
    model,
    completeTask(data) {
      dispatch({
        type: getEffectOrReducerByName('completeTask'),
        payload: data
      })
    },
  }

  return(
    <div>
      <Header {...EditTeamShowContentProps} updateDatas={updateDatas}/>
      <EditTeamShowContent {...EditTeamShowContentProps} updateDatas={updateDatas}/>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, editTeamShow, loading }) {
  return { modal, model: editTeamShow, loading }
}
export default connect(mapStateToProps)(EditTeamShow)


