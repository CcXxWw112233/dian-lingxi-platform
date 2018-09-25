import React from 'react'
import indexStyles from './index.less'
import { Input, Checkbox, Select, Button, DatePicker  } from 'antd'
import moment from 'moment';
import EditFormThreeTwoModal from './EditFormThree_Two_Modal'

const Option = Select.Option;

export default class EditFormThree_One extends React.Component {

  state = {
    modalVisible: false
  }
  setShowModalVisibile() {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  render() {
    return (
      <div className={indexStyles.EditFormThreeOneOut}>
         <div className={indexStyles.EditFormThreeOneOut_delete}>
           <div></div>
         </div>
         <div className={indexStyles.EditFormThreeOneOut_form}>
           <div className={indexStyles.EditFormThreeOneOut_form_left}></div>
           <div className={indexStyles.EditFormThreeOneOut_form_right}>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>标题</p>
               <Input style={{width: 68, height: 24}}/>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>选项</p>
               <Button style={{width: 122, height: 24}} onClick={this.setShowModalVisibile.bind(this)}>编辑选项</Button>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>默认值</p>
               <Select defaultValue={''} style={{ width: 88}} size={'small'}>
                 <Option value="">不校验格式</Option>
                 <Option value="mobile">手机号码</Option>
               </Select>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>预设规则</p>
               <Select defaultValue={'redio'} style={{ width: 86}} size={'small'}>
                 <Option value="redio">单选</Option>
                 <Option value="mobile">多选</Option>
                 <Option value="province">省市区</Option>
               </Select>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem} style={{textAlign: 'center'}}>
               <p>必填</p>
               <Checkbox />
             </div>
           </div>
         </div>
         <EditFormThreeTwoModal modalVisible={this.state.modalVisible} setShowModalVisibile={this.setShowModalVisibile.bind(this)} {...this.props}/>
      </div>
    )
  }

}
