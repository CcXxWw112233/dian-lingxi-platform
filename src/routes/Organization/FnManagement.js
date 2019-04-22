import React from 'react'
import Card from '../../components/CardComps'
import { message } from 'antd'
export default class FnManagement extends React.Component{
  state = {
    basic_datas: [],
    experiment_datas: []
  }
  componentDidMount() {
    this.props.getFnManagementList()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      basic_datas: nextProps.model.datas.fnmanagement_list.base_function_list,
      experiment_datas: nextProps.model.datas.fnmanagement_list.experiment_function_list
    })
  }
  render() {
    // const that = this
    
    const change = (id, bl) => {
      // console.log(id, bl)
      bl===true?message.success('已开启流程功能'):message.warning('已关闭流程功能')
      this.props.setFnManagement({
        id: id,
        status: bl?1:0
      })
    }
    return (
      <div>
        <Card
          title='基础功能'
          dataSource={this.state.basic_datas}
          change={change}
        ></Card>

        <Card 
          title='实验室功能' 
          titleSub='实验室是尚不成熟的实验性功能的测试场所。这些功能有可能成为新的功能正式上线， 也随时可能会发生变化、无法正常运行或消失。'
          dataSource={this.state.experiment_datas}
          change={change}
        ></Card>
      </div>
    )
  }
}