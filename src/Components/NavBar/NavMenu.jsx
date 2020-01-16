import React from "react";
import { Link, Redirect } from "react-router-dom";
import "./NavMenu.css";
import {
  Container,
  Form,
  FormControl,
  Navbar,
  Image,
  Dropdown
} from "react-bootstrap";
import {
  MDBBtn,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdown
} from "mdbreact";
import { FormSelect } from "shards-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//  REDUX_ACTIONS
import GetAllPosts from "../../Redux/actions/GetAllPosts";
import GetPostsByTitle from "../../Redux/actions/GetPostsByTitle";
import GetPostsByCategory from "../../Redux/actions/GetPostsByCategory";
import GetPostsByCT from "../../Redux/actions/GetPostsByCT";
import GetPostsByCS from "../../Redux/actions/GetPostsByCS";
import GetPostsByCST from "../../Redux/actions/GetPostsByCST";
import GetAllUserPosts from "../../Redux/actions/UserPostsActions/GetAllUserPosts";

class NavMenu extends React.Component {
  state = {
    search: "",
    category: "",
    subCategory: "",
    isLoggedOut: false
  };
  componentWillMount() {
    if (this.props.inUserPosts) {
      this.setState({ inUserPosts: true });
    }
  }

  changeHandler = e => {
    if (!this.state.category) {
      this.setState({ subCategory: "" });
    }
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { search, category, subCategory } = this.state;

      if (!search && !category && !subCategory) {
        return !this.props.usedForHome ? null : this.props.getAllPosts();
      }
      if (search && !category && !subCategory) {
        this.props.getPostsByTitle(search);
      }
      if (category && !search && !subCategory) {
        this.props.getPostsByCategory(category);
      }
      if (category && subCategory && !search) {
        this.props.getPostsByCS(category, subCategory);
      }
      if (category && !subCategory && search) {
        this.props.getPostsByCT(category, search);
      }
      if (category && subCategory && search) {
        this.props.getPostsByCST(category, subCategory, search);
      }
    });
  };

  componentDidMount() {}

  handleLogout = () => {
    this.setState({ isLoggedOut: true });
    localStorage.removeItem("jwt");
  };

  render() {
    if (this.props.isUser) {
      // console.log(this.props.isUser.sub);
    }
    return (
      <div>
        <Navbar bg="light" variant="light" className="navbar">
          <Container>
            <Link to="/Home">
              <h1>Upper</h1>
            </Link>

            <Form className="search-bar">
              <FormControl
                type="text"
                placeholder="Search"
                className="search-bar"
                name="search"
                onChange={e => this.changeHandler(e)}
              />
              <i
                className="fas fa-search search-icon"
                style={{ marginRight: "5px" }}
              ></i>
            </Form>

            {this.props.isUser ? (
              <>
                <Link
                  to={`/userpage/${this.props.isUser.sub.id}`}
                  onClick={() =>
                    this.props.getAllUserPosts(this.props.isUser.sub.id)
                  }
                  className="profile-link"
                >
                  <Image
                    style={{ width: "50px", height: "50px" }}
                    roundedCircle
                    src="https://place-hold.it/300x200"
                  />
                  <h6 style={{ alignSelf: "flex-end", marginLeft: "10px" }}>
                    {this.props.isUser.sub.userName}
                  </h6>
                </Link>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="drop-down-icon"
                  >
                    <i class="far fa-user"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="drop-down-menu">
                    <Dropdown.Item
                      onClick={this.handleLogout}
                      className="drop-down-item"
                    >
                      Logout
                      {this.state.isLoggedOut ? window.location.reload() : null}
                    </Dropdown.Item>
                    <Link
                      to={`/editProfile/${this.props.isUser.sub.id}`}
                      className="drop-down-item"
                    >
                      Edit account
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="login-or-register-btngroup">
                <Link to="/Login">
                  <MDBBtn color="primary" className="social">
                    Login
                  </MDBBtn>
                </Link>

                <Link to="/Register">
                  <MDBBtn color="danger" className="social">
                    Register
                  </MDBBtn>
                </Link>
              </div>
            )}
          </Container>
        </Navbar>
        {this.props.usedForHome &&
          (this.props.loadingCategories ? (
            <Container>
              <h1 className="loading">...Loading</h1>
            </Container>
          ) : (
            <Container>
              <div className="sort-by-category">
                <FormSelect
                  className="mb-2 category-form category-selector"
                  style={{ width: "260px" }}
                  name="category"
                  onChange={e => this.changeHandler(e)}
                >
                  <option value="">All</option>
                  {this.props.categories.map((category, i) => {
                    return (
                      <option key={i} value={category._id}>
                        {category.title}
                      </option>
                    );
                  })}
                </FormSelect>
                <FormSelect
                  className="mb-2 category-form sub-category-selector"
                  style={{ width: "260px" }}
                  name="subCategory"
                  onChange={e => this.changeHandler(e)}
                >
                  <option value="All" value="">
                    All
                  </option>
                  {this.props.categories.map((category, i) => {
                    return (
                      this.state.category == category._id &&
                      category.subCategories.map((subCategory, i) => {
                        return (
                          <option key={i} value={subCategory._id}>
                            {subCategory.title}
                          </option>
                        );
                      })
                    );
                  })}
                </FormSelect>
              </div>
            </Container>
          ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.CategoriesReducer.categories,
  loadingCategories: state.CategoriesReducer.loading
});
const mapDispatchToProps = dispatch => ({
  getAllPosts: bindActionCreators(GetAllPosts, dispatch),
  getPostsByTitle: bindActionCreators(GetPostsByTitle, dispatch),
  getPostsByCategory: bindActionCreators(GetPostsByCategory, dispatch),
  getPostsByCT: bindActionCreators(GetPostsByCT, dispatch),
  getPostsByCS: bindActionCreators(GetPostsByCS, dispatch),
  getPostsByCST: bindActionCreators(GetPostsByCST, dispatch),
  getAllUserPosts: bindActionCreators(GetAllUserPosts, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);
