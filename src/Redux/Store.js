import { createStore, applyMiddleware, compose } from "redux";
import RootReducer from "./reducers/RootReducer";
import thunk from "redux-thunk";

const Store = createStore(RootReducer, compose(applyMiddleware(thunk)));

export default Store;
