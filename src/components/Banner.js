import React, { useState, useEffect } from 'react';
import { parseJwt } from '../util';
import { Box, Text, VStack } from '@chakra-ui/react';

export default function Banner(props) { 
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [sub, setSub] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                let decodedToken = parseJwt(token);
                setEmail(decodedToken['email'] || '');
                setRole(decodedToken['role'] || '');
                setSub(decodedToken['sub'] || '');
            } catch (error) {
                console.error("Error decoding the token:", error);
            }
        }
    }, []);

    return (
        <Box p={5} shadow="md" borderWidth="1px">
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg">Email: {email}</Text>
                <Text fontSize="lg">Role: {role}</Text>
                <Text fontSize="lg">Subject: {sub}</Text>
            </VStack>
        </Box>
    );
}
