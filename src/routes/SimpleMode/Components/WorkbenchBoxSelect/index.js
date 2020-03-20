import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon, message, Tooltip, Button } from 'antd';
import { isColor } from '@/utils/util'

const WorkbenchBoxSelect = (props) => {
  const { dispatch, workbenchBoxList = [], myWorkbenchBoxList = [] } = props;
  const closeBoxManage = () => {
    props.setHomeVisible({
      simpleHeaderVisiable: true,
      myWorkbenchBoxsVisiable: true,
      wallpaperSelectVisiable: true,
      workbenchBoxSelectVisiable: false,
      createProjectVisiable: false,
    });
  }
  const selectOrCancelCurrWorkbenchBox = (e, data) => {
    e.stopPropagation();
    // if (data.status == 0 && !data.isSelected) {
    //   message.warn("功能开发中，请耐心等待");
    //   return;
    // }
    const { id } = data;
    if (!data.isSelected) {
      dispatch({
        type: 'simplemode/myboxSet',
        payload: { id }
      });
    } else {
      dispatch({
        type: 'simplemode/myboxCancel',
        payload: { id }
      });
    }

  }

  const { allWallpaperList = [], currentUserWallpaperContent, userInfo = {} } = props;
  const { wallpaper = '' } = userInfo;
  const wallpaperContent = currentUserWallpaperContent ? currentUserWallpaperContent : wallpaper;
  let bgStyle = {}
  if (isColor(wallpaperContent)) {
    bgStyle = { backgroundColor: wallpaperContent };
  } else {
    bgStyle = { backgroundImage: `url(${wallpaperContent})` };
  }
  // 渲染svg
  const renderIconSVG = (code) => {
    let contain = 's'
    switch (code) {
      case 'board:plans': //项目计划
        contain = (
          <svg t="1584694920941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14704" width="72" height="76"><path d="M873.408 182.656h-166.72V119.04a7.936 7.936 0 0 0-7.936-7.936h-55.616a7.936 7.936 0 0 0-7.936 7.936v63.552h-254.08V119.04a7.936 7.936 0 0 0-7.936-7.936h-55.552a7.936 7.936 0 0 0-7.936 7.936v63.552H142.912a31.744 31.744 0 0 0-31.744 31.744v659.008c0 17.6 14.208 31.808 31.744 31.808h730.496a31.744 31.744 0 0 0 31.808-31.808V214.4a31.744 31.744 0 0 0-31.808-31.744z" fill="#D8D8D8" opacity=".652" p-id="14705"></path><path d="M308.736 257.28v54.016h69.888V257.28h254.08v54.016h69.888V257.28h117.696c13.824 0 25.088 11.264 25.088 25.152v521.472a25.152 25.152 0 0 1-25.088 25.152H187.072a25.152 25.152 0 0 1-25.088-25.152V282.432c0-13.888 11.2-25.088 25.088-25.088h121.6z m453.824 423.168H352.448a12.8 12.8 0 0 0-12.8 12.8v38.4c0 7.104 5.76 12.8 12.8 12.8h410.112a12.8 12.8 0 0 0 12.8-12.8v-38.4a12.8 12.8 0 0 0-12.8-12.8z m-76.864-160.192H275.584a12.8 12.8 0 0 0-12.8 12.8v38.4c0 7.104 5.696 12.8 12.8 12.8h410.112a12.8 12.8 0 0 0 12.8-12.8v-38.4a12.8 12.8 0 0 0-12.8-12.8z m76.864-147.392H499.84a12.8 12.8 0 0 0-12.8 12.8v38.4c0 7.104 5.76 12.8 12.8 12.8h262.72a12.8 12.8 0 0 0 12.8-12.8v-38.4a12.8 12.8 0 0 0-12.8-12.8z" fill="#FFFFFF" p-id="14706"></path></svg>
        )
        break
      case 'board:chat': //项目交流
        contain = (
          <svg t="1584695335803" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14824" width="72" height="76"><path d="M325.76 319.424h553.6a62.08 62.08 0 0 1 62.272 61.888v339.52a62.08 62.08 0 0 1-62.272 61.824h-86.528v88.32a20.032 20.032 0 0 1-29.76 15.168l-9.984-5.632-165.952-95.232a20.224 20.224 0 0 0-9.92-2.56h-251.52a62.08 62.08 0 0 1-62.208-61.888V381.312a62.08 62.08 0 0 1 62.208-61.888z" fill="#D8D8D8" opacity=".65" p-id="14825"></path><path d="M780.416 186.24c38.912 0 70.464 31.552 70.464 70.464v386.88c0 38.912-31.552 70.464-70.4 70.464h-220.8a22.72 22.72 0 0 0-11.2 3.008l-187.904 108.48-11.328 6.528a22.592 22.592 0 0 1-33.664-17.28v-100.736h-161.92A70.464 70.464 0 0 1 83.2 643.584V256.704c0-38.912 31.552-70.4 70.4-70.4zM495.488 528.448h-215.04a17.152 17.152 0 0 0-17.152 17.152v23.68c0 9.472 7.68 17.152 17.088 17.152h215.04c9.536 0 17.152-7.68 17.152-17.152v-23.68a17.152 17.152 0 0 0-17.088-17.152z m156.544-139.136H280.32a17.152 17.152 0 0 0-17.088 17.152v23.68c0 9.472 7.68 17.152 17.088 17.152h371.648c9.472 0 17.088-7.68 17.088-17.152v-23.68a17.152 17.152 0 0 0-17.088-17.152z" fill="#FFFFFF" p-id="14826"></path></svg>
        )
        break
      case 'board:files': //项目文档
        contain = (
          <svg t="1584695393532" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14944" width="72" height="76"><path d="M387.84 170.24c62.08 0 112.32 49.6 112.32 110.848l-0.064 49.152h327.04v400h-327.04v49.6a55.808 55.808 0 0 1-56.064 55.424H163.328a55.808 55.808 0 0 1-56.128-55.424V225.664c0-30.592 25.152-55.424 56.128-55.424H387.84z" fill="#D8D8D8" opacity=".65" p-id="14945"></path><path d="M842.816 253.12c31.232 0 56.576 24.832 56.576 55.424v471.296a56 56 0 0 1-56.576 55.424H163.776a56 56 0 0 1-56.576-55.424v-526.72h735.616zM268.864 586.432a37.824 37.824 0 1 0 0 75.648 37.824 37.824 0 0 0 0-75.648z m470.656 6.272H382.336a18.88 18.88 0 0 0-18.944 18.88v25.216c0 10.432 8.512 18.88 18.944 18.88h357.12a18.88 18.88 0 0 0 18.944-18.88v-25.216a18.88 18.88 0 0 0-18.88-18.88zM268.8 422.464a37.824 37.824 0 1 0 0 75.648 37.824 37.824 0 0 0 0-75.648z m470.656 6.336H382.336a18.88 18.88 0 0 0-18.944 18.88v25.152c0 10.432 8.512 18.88 18.944 18.88h357.12a18.88 18.88 0 0 0 18.944-18.88v-25.152a18.88 18.88 0 0 0-18.88-18.88z" fill="#FFFFFF" p-id="14946"></path></svg>)
        break
      case 'mine:shows': //我的展示
        contain = (
          <svg t="1584695828403" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15544" width="72" height="76"><path d="M759.552 113.792c28.672 0 51.136 23.744 51.136 54.144v748.224H736.64v-3.52l-335.744 26.048V211.712l330.688-27.648H287.36v732.16H213.312V167.872c0-30.4 22.464-54.144 51.2-54.144h495.04zM448 540.416a21.312 21.312 0 1 0 0-42.624 21.312 21.312 0 0 0 0 42.624z" p-id="15545"></path></svg>)
        break
      case 'profession:template': //专业模板
        contain = (
          <svg t="1584695895033" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15663" width="72" height="76"><path d="M808.7 350.9L605 375.1v-21l203.7-24.3v21.1z m-43 50.8L605 413.1V434l160.7-11.4v-20.9z m15.1 66.2L605 472.1V493l175.8-4.2v-20.9z m27.9 68L605 531v20.9l203.7 4.8v-20.8z m-13.8 67.5L605 590v20.9l189.9 13.5v-21z m-67.6 60L605 648.9v21l122.2 14.6v-21.1zM960 220v584l-35.7-5.5v5.5l-35.6-5.5v5.5l-351.4-54.1V556.2L493.1 590v-50h-77.7v209.9L64 804V220l351.4 54.1V484h77.7v-50l44.2 33.8V274.1L888.7 220v5.5l35.6-5.5v5.5L960 220zM144 419.5l160.7 11.4V410L144 398.5v21z m0 68.6l175.8 4.2v-20.9L144 467.2v20.9z m122.2 170.5L144 673.1v21l122.2-14.6v-20.9z m67.6-67.6L144 604.5v20.9L333.8 612v-21z m13.9-60L144 535.9v20.9l203.7-4.8v-21z m0-176.9L144 329.8v21l203.7 24.3v-21zM415.4 540v-56h-37.1v56h37.1z m452.9-296.2l-310.6 47.8v191.8l37.5 28.7-37.5 28.7v191.8l310.6 47.8V243.8z m35.7 0l-15.3 2.3v531.8l15.3 2.3V243.8z m35.6 0l-15.3 2.3v531.8l15.3 2.3V243.8z" p-id="15664"></path></svg>)
        break
      case 'cases': //案例
        contain = (
          <svg t="1584695449668" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15184" width="72" height="76"><path d="M271.232 179.2h526.464a40.96 40.96 0 0 1 40.96 40.96v645.12H199.552v-614.4c0-39.616 32.128-71.68 71.68-71.68z" fill="#FFFFFF" p-id="15185"></path><path d="M227.712 691.2a15.36 15.36 0 0 1 15.36 15.36v30.72a15.36 15.36 0 0 1-15.36 15.296h-57.728a15.36 15.36 0 0 1-15.36-15.36v-30.72a15.36 15.36 0 0 1 15.36-15.296h57.728z m422.528-11.712a15.36 15.36 0 0 1 15.36 15.36v30.72a15.36 15.36 0 0 1-15.36 15.296H414.72a15.36 15.36 0 0 1-15.36-15.36v-30.72a15.36 15.36 0 0 1 15.36-15.296h235.52z m48.32-94.656a15.36 15.36 0 0 1 15.36 15.36v30.72a15.36 15.36 0 0 1-15.36 15.296H371.328a15.36 15.36 0 0 1-15.36-15.36v-30.72a15.36 15.36 0 0 1 15.36-15.296h327.232zM532.608 258.304l43.136 86.592 95.616 14.272L602.368 426.88l16 95.36-85.76-44.672-85.76 44.672 16-95.36-69.056-67.84 95.68-14.208 43.136-86.592zM227.712 294.4a15.36 15.36 0 0 1 15.36 15.36v30.72a15.36 15.36 0 0 1-15.36 15.296h-57.728a15.36 15.36 0 0 1-15.36-15.36v-30.72a15.36 15.36 0 0 1 15.36-15.296h57.728zM227.84 833.152h610.816v56.448H227.776a28.16 28.16 0 1 1 0-56.448z" fill="#D8D8D8" p-id="15186"></path></svg>)
        break
      case 'regulations': //政策法规
        contain = (
          <svg t="1584695943922" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10081" width="72" height="76"><path d="M512.256 128.128c198.208 74.304 318.464 311.808 215.424 504.32L476.288 379.84l96-96.256-60.032-59.776c-33.152 32.448-85.76 39.36-121.28 25.088L199.936 440.064l108.16 107.776 72.128-71.808 251.328 252.16c-122.944 67.52-293.44 46.208-419.264-84.48l-60.928 60.8c18.24 25.28 33.536 48.192 52.544 67.392-1.6 1.984-6.848 6.272-6.976 6.4-3.2-0.512-6.976-1.728-10.304-1.728-32.448 0-58.624 28.16-58.624 60.608 0 32.384 26.432 58.816 58.88 58.816 32.384 0 60.16-26.688 60.16-59.072 0-3.84-0.896-7.232-1.536-10.816l9.344-9.152c144.64 97.536 303.168 109.696 473.792 7.616l70.4 70.656 96.448-95.104-70.912-71.616c203.456-306.56-67.84-607.744-312.32-600.32z" p-id="10082"></path></svg>)
        break
      case 'maps': //地图
        contain = (
          <svg t="1584695578138" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15304" width="72" height="76"><path d="M155.904 181.76m93.632 0l529.792 0q93.632 0 93.632 93.632l0 506.56q0 93.632-93.632 93.632l-529.792 0q-93.632 0-93.632-93.632l0-506.56q0-93.632 93.632-93.632Z" fill="#FFFFFF" p-id="15305"></path><path d="M654.08 181.76L376.192 459.712l414.976 415.104c-3.84 0.512-7.808 0.768-11.84 0.768l-86.144-0.064L326.784 509.056 155.904 679.936V581.312L555.392 181.76h98.688z" fill="#D8D8D8" p-id="15306"></path><path d="M786.048 121.6c81.28 0 147.2 66.752 147.2 149.12 0 91.2-88.768 172.928-134.528 216.96a18.24 18.24 0 0 1-25.408 0c-46.848-45.184-134.464-125.44-134.464-216.96 0-82.368 65.92-149.12 147.2-149.12z m0 93.12a55.68 55.68 0 0 0-55.296 55.936 55.68 55.68 0 0 0 55.296 56 55.68 55.68 0 0 0 55.232-56 55.68 55.68 0 0 0-55.232-55.936zM303.04 619.648c48.768 0 88.32 40.064 88.32 89.408 0 54.784-53.312 103.808-80.768 130.24a10.88 10.88 0 0 1-15.168 0c-28.16-27.136-80.704-75.328-80.704-130.24 0-49.344 39.488-89.408 88.32-89.408z m0 55.872a33.344 33.344 0 0 0-33.216 33.536c0 18.56 14.848 33.6 33.216 33.6a33.344 33.344 0 0 0 33.152-33.6 33.344 33.344 0 0 0-33.152-33.536z" fill="#D8D8D8" p-id="15307"></path></svg>)
        break
      case 'mine:flows': //工作流
        contain = (
          <svg t="1584695767601" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15425" width="72" height="76"><path d="M305.28 128h413.44A177.28 177.28 0 0 1 896 305.28v413.44A177.28 177.28 0 0 1 718.72 896H305.28A177.28 177.28 0 0 1 128 718.72V305.28A177.28 177.28 0 0 1 305.28 128z m11.2 481.472c0-33.088 12.736-51.264 42.048-60.224h279.04c80.192 4.672 127.36-35.328 127.36-112.256 0-76.224-46.08-118.144-127.36-118.144h-199.04a27.392 27.392 0 0 0 0 54.784h199.04c52.032 0.064 72.512 18.688 72.512 63.36 0 43.904-19.392 60.416-70.912 57.408l-284.544-0.128-7.232 0.96c-55.744 15.232-85.76 55.424-85.76 114.24 0 59.776 31.424 98.24 88.704 107.328l182.016 0.384a27.456 27.456 0 0 0 0-54.912H354.56c-25.792-4.416-38.08-19.456-38.08-52.8h-0.064z m382.528 157.504a83.584 83.584 0 1 0 0-167.168 83.584 83.584 0 0 0 0 167.168zM306.176 407.424a62.72 62.72 0 1 0 0-125.376 62.72 62.72 0 0 0 0 125.44z" p-id="15426"></path></svg>)
        break
      default:
        break
    }
    return contain
  }
  const renderBoxItem = (boxItem, isSelected) => {
    return (
      <div key={boxItem.id} className={indexStyles.workbenchBox} onClick={(e) => { selectOrCancelCurrWorkbenchBox(e, { id: boxItem.id, isSelected: isSelected, status: boxItem.status }) }} disabled={boxItem.status == 0 ? true : false}>
        {/* <i dangerouslySetInnerHTML={{ __html: boxItem.icon }} className={`${globalStyles.authTheme} ${indexStyles.workbenchBox_icon}`} ></i><br /> */}
        <div>
          {renderIconSVG(boxItem.code)}
        </div>
        <div>
          <span className={indexStyles.workbenchBox_title}>{boxItem.name}</span>
        </div>
        {isSelected && (
          <span>
            <div className={indexStyles.workbenchBoxSelected}><Icon type="check-circle" theme="filled" style={{ fontSize: '24px' }} /></div>
            <div className={indexStyles.workbenchBoxSelectedBg}></div>
          </span>
        )}

        {!isSelected &&
          <div className={indexStyles.workbenchBoxSelectHover}></div>
        }

      </div>
    )
  }
  return (
    <div onClick={(e) => { closeBoxManage(e) }}>
      <div className={indexStyles.selectWorkbenchBoxWapperModalBg} style={bgStyle}></div>
      <div className={indexStyles.selectWorkbenchBoxWapperModal}>
        <div style={{ paddingLeft: '96px', paddingTop: '44px' }}>
          <div className={indexStyles.backBtn}><Icon type="left" />返回</div>
        </div>
        <div className={indexStyles.workbenchBoxWapper}>
          {
            workbenchBoxList.map((boxItem, key) => {
              let isSelected = myWorkbenchBoxList.filter(item => item.id == boxItem.id).length > 0 ? true : false;
              //console.log("8888", isSelected);
              return (
                boxItem.status == 0 ? (
                  <Tooltip title="功能开发中，请耐心等待">
                    {renderBoxItem(boxItem, isSelected)}
                  </Tooltip>
                ) :
                  renderBoxItem(boxItem, isSelected)
              )
            })
          }

        </div>
        <div className={indexStyles.footer}>
          <div className={indexStyles.operationTip}>点击空白处或按“ESC“键返回</div>
        </div>
      </div>
    </div>
  );
}
export default connect(({
  simplemode: { workbenchBoxList, myWorkbenchBoxList, currentUserWallpaperContent },
  technological: {
    datas: { userInfo }
  } }) => ({ workbenchBoxList, myWorkbenchBoxList, currentUserWallpaperContent, userInfo }))(WorkbenchBoxSelect)
