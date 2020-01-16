import axios from "axios";

const GetPostsByCS = (category, subCategory) => {
  return dispatch => {
    axios
      .get("/api/filter_posts_by_category_&_sub", {
        params: {
          category: category,
          subCategory: subCategory
        }
      })
      .then(res => {
        if (res.data.length) {
          dispatch({ type: "GET_POSTS_BY_CATEGORY_&_SUB", payload: res.data });
        }
      })
      .catch(err => console.log(err));
  };
};

export default GetPostsByCS;
