import { alpha, Box, Card, Stack, Button } from "@mui/material";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { editPost } from "./postSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const defaultValues = {
  content: "",
  image: "",
};

function PostEdit({ post, handleCloseModal }) {
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.post);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = (data) => {
    data.postId = post._id;
    data.userId = post.author._id;
    dispatch(editPost(data)).then(() => {
      reset();
      handleCloseModal();
    });
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            placeholder="Share what you are thinking here..."
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />

          <FUploadImage
            name="image"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <LoadingButton
              variant="outlined"
              type="submit"
              size="small"
              loading={isSubmitting || isLoading}
            >
              Save
            </LoadingButton>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostEdit;
