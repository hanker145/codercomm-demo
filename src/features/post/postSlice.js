import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService"
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";
import { getCurrentUserProfile } from "../user/userSlice";

const initialState = {
    isLoading: false,
    error: null,
    postsById: {},
    currentPagePosts: []
}
const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },

    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts.length % POST_PER_PAGE === 0)
        state.currentPagePosts.pop();
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },

    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { posts, count } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },

    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // console.log("sendreactions", action.payload);
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // console.log(action.payload);

      state.currentPagePosts = state.currentPagePosts.filter(
        (item) => item !== action.payload._id
      );
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
  },
});


export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getPosts =
  ({ userId, page, limit = POST_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      
    }
  };


  export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
     
    }
  };



  export const deletePost =
  ({ postId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const response = await apiService.delete(`/posts/${postId}`);
      dispatch(slice.actions.deletePostSuccess(response.data));
      toast.success("Post Deleted");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

  export const editPost =
  ({ postId, content, image, userId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);
      const data = {
        content,
      };

      if (imageUrl) {
        data.image = imageUrl;
      }
      const response = await apiService.put(`/posts/${postId}`, data);

      dispatch(slice.actions.editPostSuccess(response.data.data));
      toast.success("Post edited");
      dispatch(getCurrentUserProfile());
      dispatch(getPosts({ userId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

  
export default slice.reducer