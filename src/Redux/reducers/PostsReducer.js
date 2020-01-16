const initialState = {
  posts: [],
  loading: true
};

const PostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_POSTS":
      return { posts: [...action.payload], loading: false };
    case "GET_POSTS_BY_TITLE":
      return { posts: [...action.payload], loading: false };
    case "GET_POSTS_BY_CATEGORY":
      return { posts: [...action.payload], loading: false };
    case "GET_POSTS_BY_CATEGORY_&_TITLE":
      return { posts: [...action.payload], loading: false };
    case "GET_POSTS_BY_CATEGORY_&_SUB":
      return { posts: [...action.payload], loading: false };
    case "GET_POSTS_BY_CATEGORY_&_SUB_&_TITLE":
      return { posts: [...action.payload], loading: false };
    default:
      return state;
  }
};

export default PostsReducer;
