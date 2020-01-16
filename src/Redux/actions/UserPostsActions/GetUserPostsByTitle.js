import axios from "axios";

const GetUserPostsByTitle = (id, search) => {
  return dispatch => {
    axios
      .get("/api/get_user_posts_by_title", {
        params: {
          id: id,
          postTitle: search
        }
      })
      .then(res => {
        // console.log(res.data);
        dispatch({ type: "GET_USER_POSTS_BY_TITLE", payload: res.data });
      })
      .catch(err => err && console.log(err));
  };
};

export default GetUserPostsByTitle;
