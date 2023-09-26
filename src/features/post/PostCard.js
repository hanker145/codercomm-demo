import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button,
  Modal,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import PostEdit from "./PostEdit";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "./postSlice";
import { LoadingButton } from "@mui/lab";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function PostCard({ post }) {
  // console.log("postId", post._id);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch((state) => state.post);

  const { isLoading } = useSelector((state) => state.post);
  const handleClickOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (value) => {
    console.log("value", value);
    if (value === "delete") {
      handleOpen();
    }
    if (value === "edit") {
      setEditMode(true);
    }
  };

 


  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
            <MenuItem onClick={() => handleClick("edit")} sx={{ mx: 1 }}>
        Edit
      </MenuItem>

      <Divider sx={{ borderStyle: "dashed" }} />
      <MenuItem onClick={() => handleClick("delete")} sx={{ mx: 1 }}>
        Delete
      </MenuItem>
    </Menu>
  );

  const renderModalConfirm = (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{ textAlign: "center", mt: 2 }}
          id="modal-modal-description"
        >
          Are you sure to delete this post ?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <LoadingButton
            variant="outlined"
            type="submit"
            size="small"
            loading={isLoading}
            onClick={() =>
              dispatch(
                deletePost({ postId: post._id, userId: post.author._id })
              )
            }
          >
            Yes
          </LoadingButton>
          <Button color="error" variant="outlined" onClick={handleClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const renderModalEdit = (
    <Modal
      open={editMode}
      onClose={() => setEditMode(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <PostEdit post={post} handleCloseModal={() => setEditMode(false)} />
      </Box>
    </Modal>
  );

  return (
    <Card>
      {editMode ? renderModalEdit : renderModalConfirm}
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton onClick={handleClickOpenMenu}>
            <MoreVertIcon sx={{ fontSize: 30 }} />
          </IconButton>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>

      {renderMenu}
    </Card>
  );
}

export default PostCard;
