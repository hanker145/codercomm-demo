import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Modal,
  Button
} from '@mui/material'
import { fDate } from '../../utils/formatTime'
import CommentReaction from './CommentReaction'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import { deleteComment } from './commentSlice'

function CommentCard({ comment }) {
  const dispatch = useDispatch()

  const handleDeleteComment = () => {
    dispatch(deleteComment(comment._id))
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    // console.log("commentId", comment._id);
    // console.log("postId", comment.post);

    // dispatch(deleteComment({ commentId: comment._id }));
    // dispatch(getComments({ postId: comment.post }));
    handleDeleteComment()
  };

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

  const renderModal = (
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
          variant="button"
        >
          Are you sure to delete this comment ?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <Button variant="outlined" onClick={handleClick}>
            Yes
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <>
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: 'background.neutral' }}>
        <Stack
          direction="row"
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {comment.content}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <CommentReaction comment={comment} />
          <IconButton
            aria-label="Delete"
            size="small"
            onClick={() => handleOpen()}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>
    </Stack>
    {open && renderModal}</>
  )
}

export default CommentCard
