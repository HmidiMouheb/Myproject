import axios from "axios";

const GetAllCategories = () => {
  return dispatch => {
    axios.get("/api/get_all_categories").then(res => {
      dispatch({ type: "GET_ALL_CATEGORIES", payload: res.data });
    });
  };
};

export default GetAllCategories;
