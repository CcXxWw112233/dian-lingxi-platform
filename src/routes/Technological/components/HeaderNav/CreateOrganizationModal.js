//重命名组件
import React from 'react'
import { Modal, Form, Button, Input, message, Select } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const TextArea = Input.TextArea

class CreateOrganizationModal extends React.Component {
  state = {
    stepContinueDisabled: true,
    operateType: '0', //0默认申请加入 ‘1’创建组织
    createButtonVisible:false, //输入框里面的按钮
  }
  descriptionChange(e) {
    const value = e.target.value
  }
  nameChange(e) {
    const value = e.target.value
    let flag = true
    if(value) {
      flag = false
    }
    this.setState({
      stepContinueDisabled: flag,
      createButtonVisible: !flag
    })
  }
  setOperateType(type) {
    this.setState({
      operateType: type,
      createButtonVisible:false
    })
  }
  onCancel = () => {
    this.props.setCreateOrgnizationOModalVisable()
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setCreateOrgnizationOModalVisable()
        console.log(values)
      }
    });
  }
  render() {
    const { createOrganizationVisable } = this.props; //reName_Add_type操作类型1重命名 2添加
    const { getFieldDecorator } = this.props.form;
    const { stepContinueDisabled, operateType, createButtonVisible } = this.state
    const formContain = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>创建或加入组织</div>
        <FormItem style={{width: 336}}>
          {getFieldDecorator('name', {
            rules: [{ required: false, message: '', whitespace: true }],
          })(
            <div style={{position: 'relative'}}>
              <Input  placeholder={'请输入'} style={{height: 40}} onChange={this.nameChange.bind(this)} maxLength={50} style={{paddingRight: 120,height: 40}}/>
              {createButtonVisible? (
                <Button type={'primary'} size={'small'} style={{position: 'absolute', right: 10, top: 8}} onClick={this.setOperateType.bind(this, '1')}>创建组织</Button>) : ('')}
            </div>
          )}
        </FormItem>

        {operateType === '0'? (
          <FormItem style={{width: 336}}>
            {getFieldDecorator('description', {
              rules: [{ required: false, message: '', whitespace: true }],
            })(
              <TextArea style={{height: 208, resize:'none'}}
                        onChange={this.descriptionChange.bind(this)}
                        placeholder="申请加入说明" maxLength={300}/>
            )}
          </FormItem>
        ) : (
          <div>
            {/*组织性质*/}
            <FormItem style={{width: 336}}>
              {getFieldDecorator('organizationProperty', {
                initialValue: '1',
                rules: [{ required: false, message: '', whitespace: true }],
              })(
                <Select  style={{ height: 40 }} size={'large'} placeholder={'请选择'}>
                  <Option value="1">投资商</Option>
                  <Option value="2">设计院</Option>
                  <Option value="3">学校</Option>
                  <Option value="4">专家</Option>
                  <Option value="5">政府</Option>
                  <Option value="6">其他</Option>
                </Select>
              )}
            </FormItem>
            {/*人数*/}
            <FormItem style={{width: 336}}>
              {getFieldDecorator('menberCount', {
                initialValue: '1',
                rules: [{ required: false, message: '', whitespace: true }],
              })(
                <Select  style={{ height: 40 }} size={'large'} placeholder={'请选择'}>
                  <Option value="1">1~30人</Option>
                  <Option value="2">31~100人</Option>
                  <Option value="3">101~300人</Option>
                  <Option value="4">301~1000人</Option>
                  <Option value="5">1000人以上</Option>
                </Select>
              )}
            </FormItem>
            <div style={{marginTop: -8,textAlign:'left', fontSize: 13,color: '#8c8c8c'}}>准确填写信息有助于我们为你安排专属顾问，协助你与你的组织成员快速上手使用。</div>
          </div>
          )}



        {/* 确认 */}
        <FormItem>
          <Button type="primary" disabled={stepContinueDisabled} htmlType={'submit'} onClick={this.nextStep} style={{marginTop:20,width: 208, height: 40}}>
            {operateType === '0'? '发送请求' : '创建企业'}
          </Button>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <Modal
          visible={createOrganizationVisable} //renameModalVisable
          width={472}
          zIndex={1006}
          footer={null}
          maskClosable={false}
          destroyOnClose
          style={{textAlign:'center'}}
          onCancel={this.onCancel}
        >
          {formContain}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(CreateOrganizationModal)
