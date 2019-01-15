/**
 * Created by out_xu on 17/7/13.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../public/cropped-ccpc_logo_small.png'
import './index.less'

const LayoutContent = (props) => {
  return (
    <div className='App'>
      <div className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {/* <h2>CCPC-CAMP</h2> */}
      </div>

      <header className='App-nav'>
        2018 CCPC-Wannafly Winter Camp行程住宿登记表
      </header>
      <div className='App-content'>
        {props.children}
      </div>
    </div>
  )
}

export default LayoutContent
