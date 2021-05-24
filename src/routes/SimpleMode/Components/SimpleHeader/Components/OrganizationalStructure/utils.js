import Konva from 'konva'

/** 长线条的高度 */
export const LineHeight = 35
/** 框和文字的间距 */
export const rectPadding = 15
/** 两个分组中间的高度间隔 */
export const betweenGroupSize = 30
/** 两个相邻节点的间距 */
export const siblingBetweenSize = 20
/** 线的宽度 */
export const strokeWidth = 4
/** 定义的全局边框颜色 */
export const strokeColor = '#9EA6C2'
/** 贝塞尔曲线大小 */
export const bezierSize = 10

/** 创建一个带框的文字
 * @param {{text: string, textStyle:{}, rectStyle:{}, options: {},x: number, y: number}} args 参数列表
 */
export const addRectText = args => {
  const {
    /** 文字 */
    text,
    /** 文字样式 */
    textStyle = {},
    /** 框的样式 */
    rectStyle = {},
    /** 线的样式 */
    lineStyle = {},
    /** 追加设置 */
    options = {},
    /** 起始的x坐标 */
    x = 0,
    /** 起始的Y坐标 */
    y = 0
  } = args

  /** 文字列表 */
  const complexText = new Konva.Text({
    x,
    y: y,
    text: text,
    fontSize: 16,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: rectPadding * 2,
    align: 'center',
    ...textStyle
  })

  /** 矩形 */
  const rect = new Konva.Rect({
    x,
    y: complexText.y() + rectPadding,
    fill: '#ddd',
    width: complexText.width(),
    height: complexText.height() / 2 + rectPadding / 2,
    // shadowColor: 'black',
    cornerRadius: 8,
    ...rectStyle
  })

  /** x在左上角，因此需要纠偏 */
  // rect.x(rect.x() - rect.width() / 2)
  // /** 文字也要进行纠偏 */
  // complexText.x(rect.x())

  /** 线段 */
  const line = new Konva.Line({
    points: [
      0, // x1
      rect.y() + rect.height(), // y1
      0, // x2
      rect.y() + rect.height() + LineHeight // y2
    ],
    x: rect.x() + rect.width() / 2,
    stroke: strokeColor,
    strokeWidth
  })

  /** 子节点向上的线条 */
  const topLine = new Konva.Line({
    points: [0, rect.y(), 0, rect.y() - LineHeight],
    x: rect.x() + rect.width() / 2,
    stroke: strokeColor,
    strokeWidth,
    ...lineStyle
  })

  rect.cache()
  line.cache()
  topLine.cache()
  complexText.cache()

  /** 一个节点的高度 */
  const nodeHeight = rect.height() + LineHeight

  return { text: complexText, rect, line, topLine, nodeHeight }
}

/** 添加子集的连接线
 * @param {Konva.Layer} 主画布
 * @param {number} x 起始点X
 * @param {number} y 起始点Y
 * @param {number} x2 结束点X
 * @param {number} y2 结束点Y
 */
export const addSubLineForS2E = (layer, x, y, x2, y2) => {
  const line = new Konva.Line({
    points: [x + bezierSize, y, x2 - bezierSize, y2],
    stroke: strokeColor,
    strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
    tension: bezierSize
  })
  line.cache()
  const Lpath = new Konva.Path({
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    data: `M${x + 1},${y + bezierSize}Q${x},${y - 1},${x + bezierSize},${y}`
  })
  Lpath.cache()
  layer.add(Lpath)
  const RPath = new Konva.Path({
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    data: `M${x2 - bezierSize},${y2}Q${x2},${y2 - 1},${x2 - 1},${y2 +
      bezierSize +
      1}`
  })
  layer.add(RPath)
  return line
}

/**
 *
 * ,
  {
    "role_group_name":"地产控股集团",
    "id": "6",
    "roles" : [
      {
        "id":"7",
        "role_group_name": "招采管理中心"
      },
      {
        "id":"8",
        "role_group_name": "工程管理中心"
      },
      {
        "id":"9",
        "role_group_name": "成本管理中心"
      },
      {
        "id":"10",
        "role_group_name": "产品研发中心"
      },
      {
        "id":"11",
        "role_group_name": "运营管理中心"
      },
      {
        "id":"12",
        "role_group_name": "投资发展中心"
      }
    ]
  }
 */
