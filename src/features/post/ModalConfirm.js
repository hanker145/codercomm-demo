import * as React from "react";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deletePost } from "./postSlice";

export default function AlertDialog(props) {
  const { open, setIdPost, id } = props;
  const dispatch = useDispatch();

  const handleClose = () => {
    setIdPost(null);
  };

  // handle delete post
  const handleDeletePost = () => {
    dispatch(deletePost(id));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure remove this post?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleDeletePost()}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
