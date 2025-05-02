export enum ActionTypes {
  // Posts
  ADD_POST = "ADD_POST",
  REMOVE_POST = "REMOVE_POST",
  UPDATE_POST = "UPDATE_POST",

  // Likes
  ADD_LIKE = "ADD_LIKE",
  REMOVE_LIKE = "REMOVE_LIKE",

  // Comments
  ADD_COMMENT = "ADD_COMMENT",
  REMOVE_COMMENT = "REMOVE_COMMENT",
  UPDATE_COMMENT = "UPDATE_COMMENT",

  // Bookmarks
  ADD_BOOKMARK = "ADD_BOOKMARK",
  REMOVE_BOOKMARK = "REMOVE_BOOKMARK",
}

export enum NavItems {
  Home = "Home",
  Search = "Search",
  Create = "Create",
  Likes = "Likes",
  Profile = "Profile",
}

export enum Routes {
  Home = "/",
  Search = "/search",
  Create = "/create",
  Likes = "/likes",
  Profile = "/profile",
}
