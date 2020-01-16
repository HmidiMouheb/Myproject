import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GetUserPostsByTitle from "../../Redux/actions/UserPostsActions/GetUserPostsByTitle";
import GetAllUserPosts from "../../Redux/actions/UserPostsActions/GetAllUserPosts";

class UserPostsSearch extends Component {
  state = {
    search: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { search } = this.state;
      if (search) {
        this.props.getUserPostsByTitle(this.props.id, search);
      }
      if (!search) {
        this.props.getAllUserPosts(this.props.id);
      }
    });
  };
  componentDidMount() {}
  render() {
    return (
      <div>
        <p>search within user Posts</p>
        <input name="search" type="text" onChange={e => this.handleChange(e)} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getAllUserPosts: bindActionCreators(GetAllUserPosts, dispatch),
  getUserPostsByTitle: bindActionCreators(GetUserPostsByTitle, dispatch)
});

export default connect(null, mapDispatchToProps)(UserPostsSearch);
