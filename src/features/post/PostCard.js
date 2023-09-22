import React from "react";
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
  Button,
  Modal,
  TextField,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import { useDispatch } from "react-redux";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import {  editPost } from "./postSlice";
import ModalConfirm from "./ModalConfirm";

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
};

function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [idPost, setIdPost] = React.useState(null);

  const [openModal, setOpenModal] = React.useState(false);
  const [editedText, setEditedText] = React.useState("");
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    dispatch(editPost(post._id, editedText));
    handleCloseModal();
  };

  const handleChange = (event) => {
    setEditedText(event.target.value);
  };

  return (
    <>
      <Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Text
            </Typography>
            <TextField
              id="modal-modal-description"
              label="Text"
              multiline
              rows={4}
              fullWidth
              value={editedText}
              onChange={handleChange}
            />
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => handleCloseModal()}>Cancel</Button>
          </Box>
        </Modal>

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
            (user._id === post.author._id || user._id === post.author) && (
              <>
                <IconButton onClick={handleClick}>
                  <MoreVertIcon sx={{ fontSize: 30 }} />
                </IconButton>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    // onClick={() => handleEditPost(post._id)}
                    onClick={handleOpenModal}
                  >
                    Edit post
                  </MenuItem>
                  <MenuItem onClick={() => setIdPost(post._id)}>
                    Delete post
                  </MenuItem>
                </Menu>
              </>
            )
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
      </Card>
      {!!idPost && (
        <ModalConfirm open={!!idPost} setIdPost={setIdPost} id={idPost} />
      )}
    </>
  );
}

export default PostCard;
