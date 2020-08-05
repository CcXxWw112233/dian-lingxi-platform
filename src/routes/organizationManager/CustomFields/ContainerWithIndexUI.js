
// 容器组件
import React, { Component, useState } from 'react'
import { Input, Button, Modal } from 'antd'
import indexStyles from './index.less'
import commonStyles from './common.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import CustomFieldCategory from './component/CustomFieldCategory'

function ContainerWithIndexUI(props) {
  console.log(props);
  const [is_add_custom_field, setAddCustomFields] = useState(false)
  const [is_add_custom_field_list, setAddCustomFieldsList] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const onChange = (e) => {
    setInputValue(e.target.value)
  }
  const onBlur = (e) => {
    let value = e.target.value
    setAddCustomFieldsList(false)
    setInputValue('')
  }
  return (
    <>
      <div className={indexStyles.custom_fields_wrapper}>
        <div>
          <div className={indexStyles.custom_title}>
            <div className={`${globalStyles.authTheme} ${indexStyles.custom_title_icon}`}>&#xe7f8;</div>
            <div className={indexStyles.custom_title_name}>
              自定义字段
        </div>
          </div>
          <div className={indexStyles.custom_add_field} onClick={() => setAddCustomFields(true)}>
            <span className={globalStyles.authTheme}>&#xe782;</span>
            <span>添加字段</span>
          </div>
          {
            is_add_custom_field_list ? (
              <div className={indexStyles.custom_add_field_list_input_field}>
                <Input
                  autoFocus={true}
                  value={inputValue}
                  onChange={(e) => { onChange(e) }}
                  onBlur={(e) => { onBlur(e) }}
                />
                <Button type="primary" disabled={!inputValue}>确定</Button>
              </div>
            ) : (
                <div className={indexStyles.custom_add_field_list} onClick={() => setAddCustomFieldsList(true)}>
                  <span className={globalStyles.authTheme}>&#xe782;</span>
                  <span>新建字段分组</span>
                </div>
              )
          }
          <hr className={commonStyles.custom_hr} />
        </div>
      </div >
      <div id={'customCategoryContainer'} className={indexStyles.customCategoryContainer}>
        {
          is_add_custom_field && (
            <Modal
              width={440}
              visible={is_add_custom_field}
              title={null}
              width={400}
              footer={null}
              destroyOnClose={true}
              maskClosable={false}
              getContainer={() => document.getElementById('customCategoryContainer')}
              onCancel={() => setAddCustomFields(false)}
              style={{ width: '440px' }}
              maskStyle={{backgroundColor: 'rgba(0,0,0,.3)'}}
            >
              <CustomFieldCategory />
            </Modal>
          )
        }
      </div>
    </>
  )
}

export default ContainerWithIndexUI;

