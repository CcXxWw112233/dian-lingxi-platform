import React from 'react'
import indexStyles from './index.less'

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
             <div>
               <p></p>
             </div>
           </div>
         </div>
      </div>
    )
  }

}
