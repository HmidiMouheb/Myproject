import axios from "axios";

const GetPostsByTitle = search => {
  return dispatch => {
    axios
      .get("/api/filter_by_title_in_all", {
        params: {
          postTitle: search
        }
      })
      .then(res => {
        if (res.data.length) {
          dispatch({ type: "GET_POSTS_BY_TITLE", payload: res.data });
        } else {
          dispatch({ type: "NO SUCH RESULT", payload: undefined });
        }
      })
      .catch(err => console.log(err));
  };
};

export default GetPostsByTitle;
