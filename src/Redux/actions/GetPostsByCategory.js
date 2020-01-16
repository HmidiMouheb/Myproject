import axios from "axios";

const GetPostsByCategory = category => {
  return dispatch => {
    axios
      .get("/api/filter_posts_by_category", {
        params: {
          category: category
        }
      })
      .then(res => {
        if (res.data.length) {
          dispatch({ type: "GET_POSTS_BY_CATEGORY", payload: res.data });
        }
      })
      .catch(err => console.log(err));
  };
};

export default GetPostsByCategory;
