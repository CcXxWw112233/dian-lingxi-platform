import React from 'react'
import indexStyles from './index.less'
import { Input, Checkbox, Select, Button, DatePicker } from 'antd'
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker

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
               <p>模式</p>
               <Select defaultValue={'SINGL'} style={{ width: 74}} size={'small'}>
                 <Option value="SINGL">单个</Option>
                 <Option value="MULTI">多个</Option>
               </Select>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>精确度</p>
               <Select defaultValue={'DATE_TIME'} style={{ width: 110}} size={'small'}>
                 <Option value="DATE_TIME">日期 + 时分</Option>
                 <Option value="DATE">日期</Option>
               </Select>
             </div>
             <div  className={indexStyles.EditFormThreeOneOutItem}>
               <p>预设值</p>
               {!true? (
                 <DatePicker
                   style={{width: 110, height: 24}}
                   size={'small'}
                   showTime
                   allowClear={false}
                   format="YYYY-MM-DD HH:mm"
                   placeholder=""
                 />
               ) : (<RangePicker
                 size={'small'}
                 style={{width: 110, height: 24}}
                 showTime={{ format: 'HH:mm' }}
                 format="YYYY-MM-DD HH:mm"
                 placeholder={[]}
               />)}

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
