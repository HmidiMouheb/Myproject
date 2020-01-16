import axios from "axios";

const GetPostsByCT = (category, search) => {
  return dispatch => {
    axios
      .get("/api/filter_posts_by_category_&_title", {
        params: {
          category: category,
          postTitle: search
        }
      })
      .then(res => {
        if (res.data.length) {
          dispatch({
            type: "GET_POSTS_BY_CATEGORY_&_TITLE",
            payload: res.data
          });
        }
      })
      .catch(err => console.log(err));
  };
};

export default GetPostsByCT;
