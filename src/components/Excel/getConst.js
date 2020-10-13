/**
 * APPTAG常量
 * @type {string}
 */
import { Resizable } from 'react-resizable'
import styles from './index.less'

export const APP_TAG = 'INSURANCE_APP'

export const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props
  console.log(props)

  if (!width) {
    return <th {...restProps} style={{ position: 'relative' }} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className={styles['react-resizable-handle']}
          onClick={e => {
            e.stopPropagation()
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ position: 'relative', width: width }} />
    </Resizable>
  )
}

export const components = {
  header: {
    cell: ResizableTitle
  }
}

export const handleResize = ({ width, index, columns }) => {
  const res = columns.map((item, i) => {
    if (i == index) {
      item.width = width
    }
    return item
  })
  console.log(res)
  return res
}
