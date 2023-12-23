import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';

import Login from './page/Login';
import AuthCallback from './page/AuthCallback';
import Contents from './page/Contents';
import Sidebar from './components/SideBar';
import Profile from './page/Profile';
import PostVerification from './page/PostVerification';
import Recommendation from './page/Recommendation';
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex>
          <Sidebar />
          <Box flex="1" p="6">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/contents" element={<Contents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/postverification" element={<PostVerification />} />
              <Route path='/Recommendation' element={<Recommendation></Recommendation>}></Route>


              {/* Add more routes as needed */}
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
