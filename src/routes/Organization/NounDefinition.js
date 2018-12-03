import React from 'react'
import { Collapse, Checkbox, Row, Col, TreeSelect, Icon, Dropdown, Menu, Modal , Button, Tree, message } from 'antd';
import indexStyles from './index.less'

export default class NounDefinition extends React.Component {
  state = {}
  selectCol = ({id, parentKey}) => {
    if(parentKey ===0 ) {
      return false
    }
    this.props.updateDatas({
      current_scheme_id: id
    })
  }
  render() {
    const { datas: {current_scheme, current_scheme_id, scheme_data=[]}} = this.props.model
    return(
      <div className={indexStyles.nounDefinitout}>
        {scheme_data.map((parentValue, parentKey)=> {
          const { field_value = [],name, id } = parentValue
          return (
            <div className={indexStyles.nounDefinit_col}>
              <div className={indexStyles.selectedDefinite} style={{display: current_scheme_id === id && parentKey !== 0?'block': 'none'}}></div>
              <div className={indexStyles.nounDefinit_col_title}
                   key={parentKey}
                   onClick={this.selectCol.bind(this, {id, parentKey})}
                   style={{borderLeft: parentKey===0? '1px solid #e5e5e5': 'none',
                     borderTopLeftRadius:  parentKey===0? '4px': 'none',
                     borderTopRightRadius:  parentKey===scheme_data.length - 1? '4px': 'none'
                   }}>
                {name}
              </div>
              {field_value.map((childValue, childKey)=> {
                const {field_name} = childValue
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
                    {field_name || field_value_name}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
