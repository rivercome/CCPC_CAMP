import React from 'react'

export default () => {
  const styleP = {
    textAlign: 'center',
    fontFamily: 'cursive',
    fontSize: 25,
    marginTop: '4%'
  }
  const styleH = {
    textAlign: 'center',
    fontFamily: 'cursive',
    fontSize: 100
  }
  return (
    <div>
      <p style={styleP}>重新登录可修改信息</p>
      <h1 style={styleH}>提交成功</h1>
    </div>
  )
}
