import React, { useState } from 'react';
import { Button, useToast, Text, Box, UnorderedList, ListItem } from '@chakra-ui/react';
import axios from 'axios';
import { baseUrl, parseJwt } from '../util';

export default function Recommendation() {
    const token = localStorage.getItem("token");
    const [recommendationData, setRecommendationData] = useState(null);
    const toast = useToast();

    const postRecommendation = () => {
        axios.post(`${baseUrl}/create_recommendation_by_student?email=${parseJwt(token)['email']}`)
            .then(response => {
                setRecommendationData(response.data.message); // Store the entire message object
                toast({
                    title: "Recommendation Posted",
                    description: "Your recommendation has been successfully posted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .catch(error => {
                toast({
                    title: "Error",
                    description: "There was an error posting the recommendation.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <>
            <Button onClick={postRecommendation}>Post Recommendation</Button>
            {recommendationData && recommendationData.response_data.msg === "success" && (
                <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">Recommended Courses:</Text>
                    <UnorderedList pl={5}>
                        {recommendationData.response_data.data.map((course, index) => (
                            <ListItem key={index}>{course}</ListItem>
                        ))}
                    </UnorderedList>
                    {/* <Text mt={2}>Fetch Time: {recommendationData.fetch_time} seconds</Text>
                    <Text mt={1}>Status: {recommendationData.response_data.msg}</Text> */}
                </Box>
            )}
            {recommendationData && recommendationData.response_data.msg === "Already fullfilled the requirements" &&
                <Text> Already fullfilled the requirements</Text>}

        </>
    );
}
