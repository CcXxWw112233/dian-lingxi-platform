import React, { Component } from 'react'
import DomToImage from 'dom-to-image'
import jsPDF from 'jspdf'
import { message, Modal } from 'antd'
import { connect } from 'dva'
import SelectDateArea from './SelectDateArea.js'
import { dateFormat } from '../../../../../../utils/util.js'
@connect(mapStateToProps)
export default class ExportGanttToImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start_time: 0, //截图区间时间
      due_time: 0,
      start_position: 0, //截图区间
      due_position: 600
    }
  }
  // 转换图片操作-------------start
  //转换图片操作类型
  domToImageOperateType = {
    png: 'toPng',
    jpeg: 'toJpeg'
  }
  // 将canvas的各个部分截取 =》 第一次生成的是一整块包含全部dom区域的画布，由于日期可选，将不同的部分截取拼接
  // 将头截取，将body截取
  // 拼接头和body
  interceptCanvas = async ({
    head_element,
    body_element,
    canvas_body_start = 0,
    canvas_body_end = 600,
    operate_action = 'jpeg'
  }) => {
    const operate_event = this.domToImageOperateType[operate_action]
    const filter = () => true
    const head_url = await DomToImage[operate_event](head_element, {
      filter
    }).catch(err => console.log('export_err', err))
    const bordy_url = await DomToImage[operate_event](body_element, {
      filter
    }).catch(err => console.log('export_err', err))
    // 将甘特图头部和躯干部份分别打成两张图
    const style_data = await Promise.all([
      this.loadImg(head_url),
      this.loadImg(bordy_url)
    ])
    //当两张图片都能够加载完成
    if (style_data.findIndex(item => !item.img_height) == -1) {
      // 裁剪头部多余位置
      const cuted_head_url_data = this.cutBodyCanvas({
        width: style_data[0].img_width,
        height: style_data[0].img_height,
        img: style_data[0].img,
        sx: 0, //起始日期
        sy: 0,
        swidth: style_data[0].img_width, //结束日期和起始日期差值宽度
        sheight: style_data[0].img_height - 60 //剪掉60多余的黑色部分
      })
      //得到最终头部最终所需数据
      const {
        img: head_img,
        img_height: head_img_height,
        img_width: head_img_width
      } = await this.loadImg(cuted_head_url_data)

      // 裁剪所需要的body宽度(起止时间)的base64
      const cuted_body_url_data = this.cutBodyCanvas({
        width: canvas_body_end - canvas_body_start,
        height: style_data[1].img_height,
        img: style_data[1].img,
        sx: canvas_body_start, //起始日期
        sy: 0,
        swidth: canvas_body_end - canvas_body_start, //结束日期和起始日期差值宽度
        sheight: style_data[1].img_height - 60
      })
      // 得到最终body所需数据
      const {
        img: final_body_img,
        img_height: final_body_img_height,
        img_width: final_body_img_width
      } = await this.loadImg(cuted_body_url_data)
      //将头部和最终裁剪的body拼接
      const final_data_url = await this.joinImage({
        head_img,
        head_img_height,
        head_img_width,
        final_body_img,
        height: final_body_img_height,
        final_body_img_height,
        final_body_img_width,
        operate_event
      })
      return Promise.resolve(final_data_url)
    }
    return Promise.resolve('')
  }
  // 裁剪甘特图躯干中间起止时间部分
  cutBodyCanvas = ({ width, height, img, sx, sy, swidth, sheight }) => {
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.width = width
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, width, height)
    const base64_data = canvas.toDataURL()
    return base64_data
  }
  loadImg = dataUrl => {
    const img = new Image()
    img.src = dataUrl
    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve({ img_height: img.height, img_width: img.width, img })
      }
      img.onerror = () => {
        resolve({ img_height: undefined, img_width: undefined, img })
      }
    })
  }
  // 拼接起来，通过dom渲染两张图，然后再一次domtoImg
  joinImage = async ({
    head_img,
    head_img_height,
    head_img_width,
    final_body_img,
    height,
    final_body_img_height,
    final_body_img_width,
    operate_event
  }) => {
    const ele = document.createElement('div')
    const id_name = 'gantt_dom_to_img_warpper'
    const dom2_margin_left = -16
    final_body_img.style['margin-left'] = `${dom2_margin_left}px`

    ele.id = id_name
    ele.style.height = `${height}px`
    ele.style.width = `${head_img_width +
      final_body_img_width +
      dom2_margin_left}px`
    ele.style.backgroundColor = '#fff'
    ele.appendChild(head_img)
    ele.appendChild(final_body_img)
    document.querySelector('body').appendChild(ele)
    const final_data_url = await DomToImage[operate_event](
      document.getElementById(id_name),
      {
        filter: () => true
      }
    ).catch(err => console.log('export_err', err))
    document.getElementById(id_name).remove()
    return Promise.resolve(final_data_url)
  }
  // 导出文件的样式处理
  toExport = (type = 'svg', pix = 2) => {
    return new Promise((resolve, reject) => {
      let header = document.querySelector('#gantt_date_area')
      let parent = document.querySelector('#gantt_card_out_middle_wrapper')
      let wapper = parent.querySelector('#gantt_group_head')
      let listHead = parent.querySelector('#gantt_header_wapper')
      let list = parent.querySelectorAll('.treeItems_i')
      let panl = document.querySelector('#gantt_operate_area_panel')
      const gantt_body = parent.querySelector('#gantt_body_wapper')
      list.forEach(item => {
        item.style.height = '38px'
        item.style.marginBottom = '0px'
      })
      let h = listHead.style.height
      if (listHead) {
        listHead.style.height = 'auto'
      }
      wapper.style.overflowY = 'inherit'
      parent.style.overflowY = 'inherit'
      let left = header.style.left
      header.style.left = 0
      let dom = parent.querySelector('#gantt_card_out_middle')
      dom.style.overflow = 'inherit'
      dom.parentNode.style.overflow = 'inherit'
      panl.nextElementSibling.style.display = 'none'
      // 过滤图片的跨域问题
      function filter(node) {
        return true
        // return (node.tagName?.toUpperCase() !== 'IMG');
      }
      // message.success('正在导出中...');
      setTimeout(async () => {
        // let dataUrl
        // if (type === 'svg') {
        //   dataUrl = await DomToImage.toSvg(parent, { filter }).catch(err => err)
        // }
        // if (type === 'png') {
        //   dataUrl = await DomToImage.toPng(parent, { filter }).catch(err => err)
        // }
        // if (type === 'jpeg') {
        //   dataUrl = await DomToImage.toJpeg(parent, { filter }).catch(
        //     err => err
        //   )
        // }
        // if (!dataUrl) reject()
        // let canvas = document.createElement('canvas')
        // let img = new Image()
        // img.src = dataUrl
        // img.onload = () => {
        //   let numbers = 0 // 重试次数
        //   canvas.height = img.height * pix
        //   canvas.width = img.width * pix
        //   let ctx = canvas.getContext('2d')
        //   ctx.drawImage(img, 0, 0, img.width * pix, img.height * pix + 80)
        //   ctx.scale(img.width / canvas.width, img.height / canvas.height)
        //   const toBlob = () => {
        //     canvas.toBlob(async blob => {
        //       // 如果奔溃，则重试 次数小于5次，继续
        //       if (!blob && numbers <= 2) {
        //         numbers++
        //         return toBlob()
        //       } else if (!blob) {
        //         // 如果大于5次，直接返回原图片
        //         if (type === 'svg') {
        //           // 如果是svg，直接导出会无法打开，需要转成jpeg
        //           dataUrl = await this.toExport('jpeg')
        //         }
        //         return resolve(dataUrl)
        //       }
        //       let url = window.URL.createObjectURL(blob)
        //       resolve(url)
        //     })
        //   }
        //   toBlob()
        // }

        //最终获取到合成图的base64
        const final_data_url = await this.interceptCanvas({
          head_element: listHead,
          body_element: gantt_body,
          operate_action: type,
          canvas_body_start: this.state.start_position,
          canvas_body_end: this.state.due_position
        })
        dom.style.overflow = 'scroll'
        header.style.left = left
        dom.parentNode.style.overflow = 'hidden'
        parent.style.overflowY = 'auto'
        wapper.style.overflowY = 'auto'
        if (listHead) {
          listHead.style.height = h
        }
        list.forEach(item => {
          item.style.height = '26px'
          item.style.marginBottom = '12px'
        })
        panl.nextElementSibling.style.display = 'block'
        resolve(final_data_url)
      }, 500)
    })
  }
  // 获取导出的文件时间
  getExportFileName = () => {
    const { start_time, due_time } = this.state
    const a = dateFormat(start_time, 'yyyy年MM月dd日')
    // debugger
    return (
      dateFormat(start_time, 'yyyy年MM月dd日') +
      '-' +
      dateFormat(due_time, 'yyyy年MM月dd日')
    )
  }

  // 导出的文件类型
  exportToFile = async type => {
    const { projectDetailInfoData = {} } = this.props

    switch (type) {
      case 'pdf':
        this.props.setShowLoading(true)
        // this.createLoadingDiv();
        let urlData = await this.toExport('png', 0.8)
        let pic = new Image()
        pic.src = urlData
        pic.onload = async () => {
          let pdf = new jsPDF({
            orientation: 'l',
            unit: 'px',
            format: [pic.width, pic.height]
          })
          pdf.addImage(pic, 'JPEG', 0, 0, pic.width, pic.height, '', 'SLOW')
          await pdf.save(
            projectDetailInfoData.board_name +
              '_' +
              this.getExportFileName() +
              '.pdf'
          )
          this.props.setShowLoading(false)
        }
        break
      case 'image':
        this.props.setShowLoading(true)
        // svg为高清图，png和jpeg为普通清晰的图
        let url = await this.toExport('jpeg', 1)
        let a = document.createElement('a')
        a.href = url
        a.download =
          projectDetailInfoData.board_name +
          '_' +
          this.getExportFileName() +
          '.png'
        a.click()
        // 内存释放
        a = null
        this.props.setShowLoading(false)
        break
      case 'svg':
        let dom = document.body
        let p = new jsPDF()
        p.html(dom, {
          callback: function(doc) {
            doc.save('test.pdf')
          }
        })
        break
      case 'excel':
        this.setExportExcelModalVisible(true)
        break
      default:
        message.warn('功能正在开发中')
    }
  }
  // 转换图片-------------------end

  setPoitionArea = ({ start_position, due_position }) => {
    this.setState({
      start_position,
      due_position
    })
  }
  setTimeArea = ({ start_time, due_time }) => {
    this.setState({ start_time, due_time })
  }

  handleOk = () => {
    const { action_type } = this.props
    this.exportToFile(action_type)
    this.handleCancel()
  }
  handleCancel = () => {
    const { setExportImgModalVisible } = this.props
    typeof setExportImgModalVisible == 'function' &&
      setExportImgModalVisible(false)
  }
  render() {
    const { visible } = this.props
    return (
      <div>
        <Modal
          title="导出甘特图"
          visible={visible}
          width={500}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <SelectDateArea
            setPoitionArea={this.setPoitionArea}
            setTimeArea={this.setTimeArea}
          />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      date_arr_one_level,
      start_date,
      end_date,
      gantt_view_mode,
      ceilWidth
    }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    date_arr_one_level,
    start_date,
    end_date,
    gantt_view_mode,
    ceilWidth,
    projectDetailInfoData
  }
}
