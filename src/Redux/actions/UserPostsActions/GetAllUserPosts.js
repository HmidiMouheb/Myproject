import axios from "axios";

const GetAllUserPosts = id => {
  return dispatch => {
    axios
      .get("/api/get_user_by_id", {
        params: {
          id: id
        }
      })
      .then(res => {
        //   console.log(res.data.posts)
        dispatch({ type: "GET_ALL_USER_POSTS", payload: res.data });
      });
  };
};

export default GetAllUserPosts;
