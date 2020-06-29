import React, { Component, useState } from 'react'
import indexStyles from './index.less'
import NameChangeInput from '../../../NameChangeInput'

function OpinionContent(props) {
  const { placeholder, value, opinionTextAreaChange } = props
  const [ opinion_click, setOpinionClick ] = useState(false)
  return (
    <div className={indexStyles.opinion_wrapper}>
      {
        opinion_click ? (
          <div>
            <NameChangeInput 
              autosize
              onBlur={()=>{setOpinionClick(false)}}
              // onPressEnter={this.titleTextAreaChangeBlur}
              // onClick={this.titleTextAreaChangeClick}
              setIsEdit={()=>{setOpinionClick(false)}}
              onChange={opinionTextAreaChange}
              autoFocus={true}
              goldName={value}
              nodeName={'textarea'}
              maxLength={500}
              style={{ display: 'block', fontSize: 14, color: '#262626', resize: 'none', minHeight: '96px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', marginTop: '4px' }}
            />
          </div>
        ) : (
            <div onClick={() => { setOpinionClick(true) }} className={indexStyles.opinion_content}>
              <span style={{color:value ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)',whiteSpace:'pre-wrap'}}>{value ? value : placeholder}</span>
            </div>
          )
      }
    </div>
  )
}

export default OpinionContent
