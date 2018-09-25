import React from 'react'
import indexStyles from './index.less'
import { Input, Checkbox, Select } from 'antd'
const Option = Select.Option;

export default class EditFormThree_One extends React.Component {

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
               <p>默认填写</p>
               <Input style={{width: 154, height: 24}}/>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>校验规则</p>
               <Select defaultValue={''} style={{ width: 106}} size={'small'}>
                 <Option value="">不校验格式</Option>
                 <Option value="mobile">手机号码</Option>
                 <Option value="tel">座机</Option>
                 <Option value="ID_card">身份证号码</Option>
                 <Option value="chinese_name">中文名（2-6）个汉字</Option>
                 <Option value="url">网址</Option>
                 <Option value="qq">QQ号</Option>
                 <Option value="postal_code">邮政编码</Option>
                 <Option value="positive_integer">正整数</Option>
                 <Option value="negative">负数</Option>
                 <Option value="two_decimal_places">精确到两位小数</Option>
               </Select>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>长度</p>
               <Input style={{width: 36, height: 24}}/>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem} style={{textAlign: 'center'}}>
               <p>必填</p>
               <Checkbox />
             </div>
           </div>
         </div>
      </div>
    )
  }

}
