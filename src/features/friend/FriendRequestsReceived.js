import React, { useEffect, useState } from 'react'
import {
  Stack,
  Typography,
  Card,
  Box,
  Pagination,
  Grid,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '../../components/Searchinput';
import UserCard from './UserCard';
import { getFriendRequests } from './friendSlice';


function FriendRequestsReceived() {
  const { currentPageUsers, usersById, totalUsers, totalPages } = useSelector(
    state => state.friend
  )

  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };
  const [filterName, setFilterName] = useState("");
  const dispatch = useDispatch()

  const [page, setPage] = useState(1);
  const users = currentPageUsers.map((userId) => usersById[userId]);
  useEffect(() => {
    dispatch(getFriendRequests({ filterName, page }))
  }, [filterName, page, dispatch])

  return (
    <Container>


<Box sx={{ width: "100%", typography: "body1" }}>

      </Box>

    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
          <SearchInput handleSubmit={handleSubmit} />
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="subtitle"
            sx={{ color: "text.secondary", ml: 1 }}
          >
            {totalUsers > 1
              ? `${totalUsers} requests found`
              : totalUsers === 1
              ? `${totalUsers} request found`
              : "No request found"}
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, page) => setPage(page)}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3} my={1}>
        {users.map((user) => (
          <Grid key={user._id} item xs={12} md={12}>
            <UserCard profile={user} />
          </Grid>
        ))}
      </Grid>
    </Card>
  </Container>
  )
}

export default FriendRequestsReceived
