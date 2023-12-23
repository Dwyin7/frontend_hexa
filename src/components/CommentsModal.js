import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    Box, Text, VStack, Input, Button, FormControl, FormLabel, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { baseUrl, parseJwt } from '../util';

export const CommentsModal = ({ reviewId, isOpen, onClose, token }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    // let token = localStorage.getItem("token")
    const toast = useToast();
    const fetchComments = () => {
        axios.get(baseUrl + `/get_comments_by_review_id?review_id=${reviewId}`)
            .then(response => {
                setComments(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
            });
    };
    useEffect(() => {
        if (isOpen && reviewId) {
            fetchComments();
        }
    }, [isOpen, reviewId]);

    const handleSubmitComment = () => {
        axios.post(baseUrl + '/post_comment', {
            review_id: reviewId,
            type: 'comment',  // Assuming 'type' is a required field
            contents: newComment,
            user_id: parseJwt(localStorage.getItem("token"))['email']// Replace with actual user ID
        })
            .then(response => {
                setComments([...comments, response.data]);
                setNewComment('');
                toast({
                    title: "Comment added",
                    description: "Your comment has been successfully added.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                fetchComments();
            })
            .catch(error => {
                console.error("Error posting comment:", error);
                toast({
                    title: "Error",
                    description: "There was an error adding your comment.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Comments</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {comments.map((comment, index) => (
                            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                                <Text fontWeight="bold">User: {comment.user_id}</Text>
                                <Text mt={2}>{comment.contents}</Text>
                            </Box>
                        ))}

                        <FormControl>
                            <FormLabel htmlFor='new-comment'>Add Comment</FormLabel>
                            <Input
                                id='new-comment'
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder='Write your comment here'
                            />
                        </FormControl>
                        <Button onClick={handleSubmitComment} colorScheme="blue">Submit Comment</Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
