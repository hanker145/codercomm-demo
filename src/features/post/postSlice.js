import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService"
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";

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
            const {count, posts} = action.payload
            posts.forEach(post => {
                state.postsById[post._id] = post;
                if (!state.currentPagePosts.includes(post._id))
                 state.currentPagePosts.push(post._id);
            })
            state.totalPosts = count;
        },
        sendPostReactionSuccess(state, action) {
          state.isLoading = false;
          state.error = null;
          const { postId, reactions } = action.payload;
          state.postsById[postId].reactions = reactions;
        },
        resetPosts(state, action) {
          state.postsById = {};
          state.currentPagePosts = [];
        },
        editPostSuccess(state, action) {
          state.isLoading = false;
          state.error = null;
          const editPost = action.payload;
    
          state.postsById = {
            ...state.postsById,
            [editPost._id]: editPost,
          };
        },
        deletedPostSuccess(state, action) {
          state.isLoading = false;
          state.error = null;
          const idPostDelete = action.payload;
          state.currentPagePosts = state.currentPagePosts.filter(
            (post) => post !== idPostDelete
          );
          delete state.postsById[idPostDelete];
          state.totalPosts = Object.keys(state.postsById).length;
        },


    }
})

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

  export const deletePost = (id) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.delete(`/posts/${id}`);
      dispatch(slice.actions.deletedPostSuccess(response.data._id));
      // call get post
      toast.success("deleted post successfully");
      // dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

  export const editPost = (id, data) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/posts/${id}`, { content: data });
      dispatch(slice.actions.editPostSuccess(response.data));
      toast.success("edited post successfully");
      // dispatch(getCurrentUserProfile());
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
  
export default slice.reducer