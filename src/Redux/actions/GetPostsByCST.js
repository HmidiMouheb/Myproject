import axios from "axios";

const GetPostsByCST = (category, subCategory, search) => {
  return dispatch => {
    axios
      .get("/api/filter_posts_by_category_&_sub_&_title", {
        params: {
          category: category,
          subCategory: subCategory,
          postTitle: search
        }
      })
      .then(res => {
        if (res.data.length) {
          dispatch({
            type: "GET_POSTS_BY_CATEGORY_&_SUB_&_TITLE",
            payload: res.data
          });
        }
      })
      .catch(err => console.log(err));
  };
};

export default GetPostsByCST;
