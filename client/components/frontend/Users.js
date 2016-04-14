import React from 'react'
import { Link } from 'react-router'
import { Row, Col, DropdownButton, MenuItem, Input, Grid, Image, Thumbnail } from 'react-bootstrap';

import RestHandler from '../../util/RestHandler';

class Users extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      users: [],
      groups: [],
      selectedGroup: {},
      searchUsersText: ''
    }
  }

  componentDidMount() {
    RestHandler.Get('/db/groups', (err, res) => {
      var groups = res.body.reverse()
      var initialGroup = res.body[0]
      this.setState({groups: groups})
      this.setState({selectedGroup: initialGroup})
      this.getUsers(initialGroup.id);
    });
  }

  getUsers(groupId) {
    var getUrl = groupId ? '/db/users/group/' + groupId : '/db/users'
    RestHandler.Get(getUrl, (err, res) => {
      this.setState({users: res.body})
    });
  }

  usersList() {
    var searchUsersText = this.state.searchUsersText
    var users = this.state.users.filter(function(name) {
      return name.username.toLowerCase().includes(searchUsersText)
    });

    return users.map(function(user, index) {
      var {username, id} = user
      return(
        <Col xs={6} sm={4} md={3} lg={3}>
          <Link to={{pathname: `users/${id}`}}>
            <div
              className="user-card">
              <Image
                src='https://pixabay.com/static/uploads/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                responsive
                />
              <h4>{username}</h4>
            </div>
          </Link>
        </Col>
      );
    });
  }
  cohortList() {
  }

  handleGroupSelect(evt, key) {
    this.setState({'selectedGroup': key});
    this.getUsers(key.id);
  }
  handleFilterUsersInput() {
    var filterText = this.refs.searchusers.refs.input.value.toLowerCase();
    this.setState({searchUsersText: filterText});
  }

  renderGroups(handleGroupSelect) {
    return this.state.groups.map (function(group) {
      var {id, group_name} = group;
      return(
        <MenuItem key={id} eventKey={group} onSelect={handleGroupSelect}>{group_name}</MenuItem>
      );
    });
  }

  render() {
    var groupName = this.state.selectedGroup.group_name;
    const innerDropdown = (
      <DropdownButton bsStyle='default' title={groupName}>
        {this.renderGroups(this.handleGroupSelect.bind(this))}
      </DropdownButton>
    );

    var title = 'Cohort38'
    return (
      <div>
        <Row className="search-for-users">
          <Col xs={12}>
            <Input
              type='text'
              ref='searchusers'
              onChange={this.handleFilterUsersInput.bind(this)}
              wrapperClassName='input-with-dropdown'
              placeholder="Search users"
              addonBefore = {innerDropdown}
              bsSize='large'/>
          </Col>
        </Row>
        <Row>
          {this.usersList()}
        </Row>
      </div>
    )
  }
}

module.exports = Users;
