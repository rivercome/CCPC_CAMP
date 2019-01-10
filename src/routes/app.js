import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Homepage from './home'
import NotFound from './404'
import Success from './success'
import Layout from 'components/Layout'
import AsyncDemo from './asyncDemo'
import Export from './export'
const App = (props) => {
  return (
    <Layout>
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route path='/home' component={Homepage} />
        <Route path='/form' component={AsyncDemo} />
        <Route path='/export' component={Export} />
        <Route path='/404' component={NotFound} />
        <Route path='/success' component={Success} />
        <Redirect from='*' to='/404' />
      </Switch>
    </Layout>
  )
}

export default App
