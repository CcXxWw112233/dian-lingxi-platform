import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal , Button, Tree, message, Input } from 'antd';
import indexStyles from './index.less'

export default class NounDefinition extends React.Component {
  state = {
    saveDisabled: false
  }
  selectCol = ({id, name, parentKey}) => {
    if(parentKey ===0 ) {
      return false
    }
    this.props.updateDatas({
      current_scheme_id: id,
      current_scheme_local: name
    })
  }
  saveNoun() {
    console.log(this.refs)
    const { datas: {current_scheme_local, current_scheme_id}} = this.props.model
    let values = []
    const refs = this.refs
    for(let i in refs) {
      if(i.toLowerCase().indexOf('input_') !== -1){
        const { value } = refs[i]
        const field_id = i.toLowerCase().replace('input_','')
        const obj = {
          field_id,
          field_value: value
        }
        values.push(obj)
      }
    }
    this.props.saveNounList({
      current_scheme_local,
      scheme_id: current_scheme_id,
      value: values,
    })
  }
  render() {
    const { datas: {current_scheme, current_scheme_id, scheme_data=[], field_data=[]}} = this.props.model
    const  field_data_value= field_data['field_value']
    return(
      <div>
        <div className={indexStyles.nounDefinitout} ref={`myInput`}>
          {scheme_data.map((parentValue, parentKey)=> {
            const { field_value = [],name, id, editable } = parentValue
            return (
              <div className={`${indexStyles.nounDefinit_col} ${current_scheme_id === id?indexStyles.selectedDefinite2: ''}`} key={parentKey}>
                {/*<div className={indexStyles.selectedDefinite} style={{display: current_scheme_id === id && parentKey !== 0?'block': 'none'}}></div>*/}
                <div className={indexStyles.nounDefinit_col_title}
                     key={parentKey}
                     onClick={this.selectCol.bind(this, {id, name, parentKey})}
                     style={{borderLeft: parentKey===0? '1px solid #e5e5e5': 'none',
                       borderTopLeftRadius:  parentKey===0? '4px': 'none',
                       borderTopRightRadius:  parentKey===scheme_data.length - 1? '4px': 'none',
                       marginTop:current_scheme_id === id? '-2px': '0',
                       borderTop:current_scheme_id === id?'2px solid rgba(24,144,255,1)': '1px solid #e5e5e5'
                     }}>
                  {name}
                </div>
                {field_value.map((childValue, childKey)=> {
                  const { field_name } = childValue
                  const field_value_name = childValue['field_value']
                  return (
                    <div className={indexStyles.nounDefinit_col_item}
                         key={childKey}
                         style={{
                           borderLeft: parentKey === 0? '1px solid #e5e5e5': 'none',
                           borderBottom: childKey === field_value.length - 1?'1px solid #e5e5e5': 'none',
                           borderBottomLeftRadius: (childKey === field_value.length - 1) && parentKey === 0? '4px': 'none',
                           borderBottomRightRadius: (childKey===field_value.length - 1) && parentKey === scheme_data.length -1 ? '4px': 'none'
                         }}>
                      {editable === '1'?(
                        <input defaultValue={field_value_name} placeholder={'输入自定义名词'} maxLength={10} ref={`Input_${field_data['field_value'][childKey]['id']}`}/>
                      ):(
                          field_name || field_value_name
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className={indexStyles.contain1}>
          当前使用：<span >{current_scheme}</span>
        </div>

        <div className={indexStyles.contain2}>
          <Button type={'primary'} onClick={this.saveNoun.bind(this)}>保存</Button>
        </div>
      </div>
    )
  }
}
