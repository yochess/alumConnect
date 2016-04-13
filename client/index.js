import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, IndexRoute } from 'react-router'
import App from './components/frontend/App'
import auth from './authHelpers.js'
import AppAuth from './components/AppAuth'
import Profile from './components/frontend/profile/Profile'
import Users from './components/frontend/Users'
import Login from './components/Login'
import Dashboard from './components/admin/Dashboard'
import DashboardHome from './components/admin/DashboardHome'
import DashboardUsers from './components/admin/DashboardUsers'

render((
  <Router history={browserHistory}>

    <Route path="/login" component={Login}/>
    <Route path="/logout" component={Login} onEnter={auth.logout}/>

    <Route path="/" component={App}>
      <IndexRoute component={Users}/>
      <Route path="/users/:user" component={Profile}/>
    </Route>
    <route path="/dashboard" component={Dashboard} onEnter={requireAdmin}>
      <IndexRoute component={DashboardHome} />
      <Route path="/dashboard/users" component={DashboardUsers} onEnter={requireAdmin}/>
    </route>
  </Router>
), document.getElementById('app'))


function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


function requireAdmin(nextState, replace) {
  var token = auth.parseJwt();
  if(!auth.loggedIn() || token.perm !== 1) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}



