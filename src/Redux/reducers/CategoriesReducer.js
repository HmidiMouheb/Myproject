const initialState = {
  categories: [],
  loading: true
};

const CategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_CATEGORIES":
      return { categories: [...action.payload], loading: false };
    default:
      return state;
  }
};

export default CategoriesReducer;
