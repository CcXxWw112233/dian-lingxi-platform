import React, { Component, useState, useEffect } from 'react'
import indexStyles from './index.less'
import NameChangeInput from '../../../NameChangeInput'

function OpinionContent(props) {
  const { placeholder, value, opinionTextAreaChange, opinionTextAreaBlur } = props
  const [ opinion_click, setOpinionClick ] = useState(false)
  let handleBlur = async(e) => {
    await (opinionTextAreaBlur && opinionTextAreaBlur(e)),
    await setOpinionClick(false)
  }
  return (
    <div className={indexStyles.opinion_wrapper}>
      {
        opinion_click ? (
          <div>
            <NameChangeInput 
              autosize
              onBlur={handleBlur}
              // onPressEnter={this.titleTextAreaChangeBlur}
              // onClick={this.titleTextAreaChangeClick}
              setIsEdit={handleBlur}
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
