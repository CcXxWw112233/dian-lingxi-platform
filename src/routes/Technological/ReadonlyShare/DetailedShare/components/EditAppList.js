import React from 'react'
import { Button } from 'antd'
import AppSwitch from './AppSwitch'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class EditAppList extends React.Component {
  state = {
    appsArray: [],
    stepTwoContinueDisabled: false
  }

  componentDidMount() {
    this.initialPageSet(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initialPageSet(nextProps)
  }

  initialPageSet(nextProps) {
    const { projectDetailInfoData = {} } = nextProps
    const { app_data = [] } = projectDetailInfoData
    let appsArray = []
    for (let val of app_data) {
      appsArray.push(val['app_id'])
    }
    this.setState(
      {
        appsArray
      },
      () => {
        this.setState({
          stepTwoContinueDisabled: !!!appsArray.length
        })
      }
    )
  }

  initialSet() {
    this.setState({
      appsArray: [],
      stepTwoContinueDisabled: true
    })
  }

  //step 2 表单单项button点击
  stepTwoButtonClick(data) {
    const { isAdd, id } = data
    const appsArray = this.state.appsArray
    let appsArray_new = [...appsArray]
    if (isAdd) {
      appsArray_new.push(id)
    } else {
      appsArray_new = appsArray_new.filter(val => val != id)
    }
    this.setState({
      appsArray: appsArray_new,
      stepTwoContinueDisabled: !appsArray_new.length
    })
  }

  // 提交表单
  handleSubmit = e => {
    let appsString = ''
    for (let val of this.state.appsArray) {
      if (val && val !== 'itemIsNull') {
        appsString += val + ','
      }
    }
    const { board_id } = this.props
    const apps = appsString
    this.initialSet()
    this.props.setAddModalFormVisibile()
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/editProjectApp',
      payload: {
        board_id,
        apps
      }
    })
  }

  render() {
    const { stepTwoContinueDisabled } = this.state

    const { appsList = [], projectDetailInfoData = {} } = this.props
    const { app_data = [] } = projectDetailInfoData

    return (
      <div>
        <div style={{ margin: '0 auto', width: 392, height: 'auto' }}>
          <div
            style={{
              fontSize: 20,
              color: '#595959',
              marginTop: 28,
              marginBottom: 28
            }}
          >
            项目功能
          </div>
          <div style={{ margin: '0 auto', width: 392 }}>
            {appsList.map((value, key) => {
              const { id } = value
              return (
                <div key={id}>
                  <AppSwitch
                    itemValue={{ ...value, itemKey: key }}
                    key={key}
                    stepTwoButtonClick={this.stepTwoButtonClick.bind(this)}
                    app_data={app_data}
                  />
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 20, marginBottom: 40 }}>
            <Button
              type="primary"
              onClick={this.handleSubmit.bind(this)}
              disabled={stepTwoContinueDisabled}
              style={{ width: 100, height: 40 }}
            >
              确认
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps({
  projectDetail: {
    datas: { projectDetailInfoData = {}, appsList = [] }
  }
}) {
  return {
    appsList,
    projectDetailInfoData
  }
}
