import React from 'react';
import {connect} from "dva/index";

const getEffectOrReducerByName = name => `project/${name}`

const ProjectDetail = (props) => {
  const { dispatch, model, modal } = props
  const prjectListProps = {
    modal,
    model,
    showModal() {
      dispatch({ type: 'modal/showModal' })
    },
    hideModal() {
      dispatch({ type: 'modal/hideModal' })
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
  return(
    <div>
      this is projectdetail
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, project, loading }) {
  return { modal, model: project, loading }
}
export default connect(mapStateToProps)(ProjectDetail)


