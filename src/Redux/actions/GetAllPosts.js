import axios from "axios";

const GetAllPosts = () => {
  return dispatch => {
    axios
      .get("/api/get_all_posts")
      .then(res => {
        dispatch({ type: "GET_ALL_POSTS", payload: res.data });
      })
      .catch(err => console.log(err));
  };
};

export default GetAllPosts;
