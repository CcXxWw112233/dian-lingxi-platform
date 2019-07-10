import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import MyWorkbenchBoxs from './Components/MyWorkbenchBoxs/index'
import WallpaperSelect from './Components/WallpaperSelect/index'

const SimpleMode = (props) => {

  console.log("YING", props);

  return (
    <div className={indexStyles.wapper}>
      
      <SimpleHeader/>

      <MyWorkbenchBoxs/>


      <WallpaperSelect/>

    


      <div className={indexStyles.createProjectWapper}>

      </div>

    </div>

  )

};

export default connect(({ }) => ({}))(SimpleMode)