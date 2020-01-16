import { combineReducers } from "redux";
import PostsReducer from "./PostsReducer";
import CategoriesReducer from "./CategoriesReducer";
import UserPostsReducer from "./UserPostsReducer";

const RootReducer = combineReducers({
  PostsReducer: PostsReducer,
  CategoriesReducer: CategoriesReducer,
  UserPostsReducer: UserPostsReducer
});

export default RootReducer;
