import React, { useState } from 'react'
import {
  Typography,
  Box,
  Container,
  Tabs,
  Tab
} from '@mui/material'
import {  useSelector } from 'react-redux'
import FriendRequestsSent from './FriendRequestsSent'
import FriendRequestsReceived from './FriendRequestsReceived'
import { capitalCase } from 'change-case'


function FriendRequests() {

  const [currentTab, setCurrentTab] = useState('Received')
  const { currentPageUsers, usersById } = useSelector(
    state => state.friend
  )
 
  const users = currentPageUsers.map(userId => usersById[userId])
  console.log(users)
  const ACCOUNT_TABS = [
    {
      value: 'Received',

      component: <FriendRequestsReceived />
    },
    {
      value: 'Sent',
      
      component: <FriendRequestsSent  />
    }
  ]
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Friend Requests
      </Typography>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ACCOUNT_TABS.map(tab => (
          <Tab
            disableRipple
            key={tab.value}
            label={capitalCase(tab.value)}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
        </Tabs>
        <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map(tab => {
        const isMatched = tab.value === currentTab
        return isMatched && <Box key={tab.value}>{tab.component}</Box>
      })}

    </Container>
  )
}

export default FriendRequests
