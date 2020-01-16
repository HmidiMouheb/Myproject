const initialState = {
  user: {},
  userPostsLoading: true
};

const UserPostsReducer = (state = initialState, action) => {
  //   console.log(action.payload);
  switch (action.type) {
    case "GET_ALL_USER_POSTS":
      return { user: action.payload, userPostsLoading: false };
    case "GET_USER_POSTS_BY_TITLE":
      return { user: action.payload, userPostsLoading: false };
    default:
      return state;
  }
};

export default UserPostsReducer;
