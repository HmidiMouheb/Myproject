import React from "react";
import "./ModalAddEdit.css";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  FormSelect
} from "shards-react";
import { InputGroup, FormControl } from "react-bootstrap";
import { MDBBtn } from "mdbreact";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GetAllPosts from "../../Redux/actions/GetAllPosts";
import GetAllCategories from "../../Redux/actions/GetAllCategories";

class ModalAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      editIsDone: false,
      postTitle: "",
      postDescription: "",
      phoneNumber: null,
      category: "",
      subCategory: "",
      postImages: "5",
      id: ""
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const {
      postTitle,
      postDescription,
      phoneNumber,
      postImages,
      subCategory,
      category,
      id
    } = this.state;
    // console.log(postTitle)

    if (!this.props.usedForEdit && !this.props.post) {
      if (postTitle && phoneNumber && category && subCategory) {
        axios.defaults.headers.common["auth"] = localStorage.getItem("jwt")
          ? localStorage.getItem("jwt")
          : undefined;

        axios
          .post("/api/add_post", {
            postTitle: postTitle,
            postDescription: postDescription,
            phoneNumber: phoneNumber,
            subCategory: subCategory,
            postImages: postImages,
            id: this.props.isUser.sub.id
          })
          .then(res => {
            console.log(res.data);
            this.setState({
              postTitle: "",
              postDescription: "",
              phoneNumber: "",
              subCategory: "",
              postImages: ""
            });
          })
          .catch(err => console.log("Errorr", err));
      }
    }
    if (this.props.post && this.props.isUser) {
      axios.defaults.headers.common["auth"] = localStorage.getItem("jwt")
        ? localStorage.getItem("jwt")
        : undefined;

      axios
        .put("/api/update_post", {
          postTitle: postTitle ? postTitle : undefined,
          postDescription: postDescription ? postDescription : undefined,
          phoneNumber: phoneNumber ? phoneNumber : undefined,
          postImages: postImages,
          id: id
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            postTitle: "",
            phoneNumber: "",
            postDescription: "",
            postImages: ""
          });
          this.props.GetAllPosts();
          this.setState({ editIsDone: true });
        })
        .catch(err => console.log(err));
    }
  };

  componentDidMount() {
    if (this.props.post && this.props.usedForEdit) {
      this.setState({ id: this.props.post._id });
    }
  }

  render() {
    const { open } = this.state;
    const { usedForEdit } = this.props;
    if (this.props.post && usedForEdit) {
      var {
        postTitle,
        postDescription,
        category,
        subCategory,
        postImages,
        phoneNumber
      } = this.props.post;
    }
    // console.log(this.state);
    // this.props.post && console.log(this.props.post.user);
    // this.props.post && this.props.isUser && console.log(this.state.id);
    // this.props.isUser && console.log(this.props.isUser);
    return (
      <div>
        <div className={usedForEdit ? null : "adding-post-group"}>
          {usedForEdit ? (
            <Button
              className="edit-button"
              squared
              theme="warning"
              onClick={this.toggle}
            >
              Edit
            </Button>
          ) : (
            <MDBBtn className="modal-openning-button" onClick={this.toggle}>
              <i className="fas fa-plus plus-icon"></i>
            </MDBBtn>
          )}
          {usedForEdit ? null : <h6>Add a post</h6>}
        </div>

        <Modal open={open} toggle={this.toggle}>
          <ModalHeader>We are happy having you!</ModalHeader>

          <ModalBody>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Product name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                name="postTitle"
                onChange={e => this.handleChange(e)}
                defaultValue={this.props.post && usedForEdit ? postTitle : ""}
              />
            </InputGroup>

            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Description</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                as="textarea"
                aria-label="Description"
                name="postDescription"
                placeholder={
                  this.props.post && usedForEdit
                    ? "if empty the old description would take place"
                    : "Description"
                }
                onChange={e => this.handleChange(e)}
                defaultValue={
                  this.props.post && usedForEdit
                    ? postDescription
                      ? postDescription
                      : null
                    : ""
                }
              />
            </InputGroup>

            <InputGroup className="mt-3">
              {"PhoneNumber"}
              <input
                type="text"
                name="phoneNumber"
                onChange={e => this.handleChange(e)}
                defaultValue={this.props.post && usedForEdit ? phoneNumber : ""}
              />
            </InputGroup>

            {!this.props.usedForEdit && !this.props.post && (
              <div className="selection-forms">
                <FormSelect
                  className="mb-2 category-form"
                  style={{ width: "260px" }}
                  name="category"
                  onChange={e => this.handleChange(e)}
                >
                  <option value="All" disabled selected hidden>
                    All
                  </option>
                  {this.props.categories.map((category, i) => {
                    return (
                      <option key={i} value={category._id}>
                        {category.title}
                      </option>
                    );
                  })}
                </FormSelect>
                <FormSelect
                  className="mb-2 sub-category-form"
                  style={{ width: "130px" }}
                  name="subCategory"
                  onChange={e => this.handleChange(e)}
                >
                  <option value="All" disabled selected hidden>
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
            )}
          </ModalBody>
          {this.state.editIsDone && (
            <div className="success-update">successfuly updated post</div>
          )}
          <div className="handling-buttons">
            <MDBBtn
              color="primary"
              className="each-button"
              onClick={this.handleSubmit}
            >
              Submit
            </MDBBtn>
            <MDBBtn
              color="danger"
              theme="danger"
              onClick={() => (
                this.toggle(), this.setState({ editIsDone: false })
              )}
            >
              Close
            </MDBBtn>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.CategoriesReducer.categories,
  loading: state.CategoriesReducer.loading
});
const mapDispatchToProps = dispatch => ({
  getAllCategories: bindActionCreators(GetAllCategories, dispatch),
  GetAllPosts: bindActionCreators(GetAllPosts, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddEdit);
