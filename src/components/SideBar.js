import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import Banner from './Banner';
import { Image } from '@chakra-ui/react';
import { parseJwt } from '../util';

const Sidebar = () => {


    let token = localStorage.getItem("token")
    let decodedToken = parseJwt(token)
    if (!decodedToken) {
        return (<></>);
    }
    let role = decodedToken['role']
    console.log("sidebar role: ", role)
    return (
        <Box width="200px" bg="blue.500" color="white" height="100vh">
            <Box padding="5">
                <Heading size="md" mb="4">Sweety Course</Heading>
                <Box>
                    <Image src="../../icon.png" alt="Sweety Course Image" mb="4" borderRadius={10}/>
                </Box>
                <Banner />
            </Box>
            <Stack as="nav">
                {/* <Link to="/" style={{ padding: '8px', display: 'block', color: 'white' }}>Home</Link> */}
                <Link to="/contents" style={{ padding: '8px', display: 'block', color: 'white' }}>Contents</Link>
                {/* Add more links as needed */}
                <Link to="/profile" style={{ padding: '8px', display: 'block', color: 'white' }}>Profile</Link>
                {role !== 'student' && (
                    <Link to="/postverification" style={{ padding: '8px', display: 'block', color: 'white' }}>Post Verification</Link>
                )}
                
                <Link to="/Recommendation" style={{ padding: '8px', display: 'block', color: 'white' }} >Recommendation</Link>


            </Stack>
        </Box>
    );
};

export default Sidebar