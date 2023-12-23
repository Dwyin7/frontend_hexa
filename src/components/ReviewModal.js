import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Button, FormControl, FormLabel, Input, NumberInput,
    NumberInputField, Textarea, Select, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { parseJwt } from '../util';
import { baseUrl } from '../util';
import { useNavigate } from 'react-router-dom';

const ReviewModal = ({ isOpen, onClose, courseNames }) => {
    let email = parseJwt(localStorage.getItem("token"))['email']

    const [review, setReview] = useState({
        user_id: email,
        course_name: "ComputerArchitecture",
        course_number: "",
        instructor_name: "",
        department: "",
        term: "Spring",
        year: "2020",
        modes_of_instruction: "In-Person",
        overall_rating: 5,
        contents: ""
    });

    const toast = useToast();

    const handleChange = (e) => {
        setReview({ ...review, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(baseUrl + "/post_review", review);
            toast({
                title: "Review submitted.",
                description: "Your review has been successfully submitted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose(); // Close the modal
        } catch (error) {
            toast({
                title: "Error submitting review.",
                description: "There was an error submitting your review.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error submitting review:", error);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Submit a Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Course Name */}
                    <FormControl id="course_name" isRequired>
                        <FormLabel>Course Name</FormLabel>
                        <Select name="course_name" value={review.course_name} onChange={handleChange}>
                            {courseNames.map(courseName => (
                                <option key={courseName} value={courseName}>{courseName}</option>
                            ))}
                        </Select>
                    </FormControl>


                    {/* Instructor Name */}
                    <FormControl id="instructor_name" isRequired>
                        <FormLabel>Instructor Name</FormLabel>
                        <Input name="instructor_name" value={review.instructor_name} onChange={handleChange} />
                    </FormControl>

                    {/* Department */}
                    <FormControl id="department" isRequired>
                        <FormLabel>Department</FormLabel>
                        <Input name="department" value={review.department} onChange={handleChange} />
                    </FormControl>

                    {/* Term */}
                    <FormControl id="term" isRequired>
                        <FormLabel>Term</FormLabel>
                        <Select name="term" value={review.term} onChange={handleChange} defaultValue={"Spring"}>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                        </Select>
                    </FormControl>

                    {/* Year */}
                    <FormControl id="year" isRequired>
                        <FormLabel>Year</FormLabel>
                        <Select name="year" value={review.year} onChange={handleChange} defaultChecked={2020}>
                            {/* Add year options */}
                            <option value={2020}>2020</option>
                            <option value={2021}>2021</option>
                            <option value={2022}>2022</option>
                            <option value={2023}>2023</option>
                            <option value={2024}>2024</option>
                        </Select>
                    </FormControl>

                    {/* Modes of Instruction */}
                    <FormControl id="modes_of_instruction" isRequired>
                        <FormLabel>Modes of Instruction</FormLabel>
                        <Select name="modes_of_instruction" defaultValue={"In-Person"} value={review.modes_of_instruction} onChange={handleChange}>
                            <option value="In-Person">In-Person</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Online only">Online only</option>
                        </Select>
                    </FormControl>

                    {/* Overall Rating */}
                    <FormControl id="overall_rating" isRequired>
                        <FormLabel>Overall Rating</FormLabel>
                        <NumberInput max={5} min={1}>
                            <NumberInputField name="overall_rating" value={review.overall_rating} onChange={handleChange} />
                        </NumberInput>
                    </FormControl>

                    {/* Review Contents */}
                    <FormControl id="contents" isRequired>
                        <FormLabel>Contents</FormLabel>
                        <Textarea name="contents" value={review.contents} onChange={handleChange} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};

export default ReviewModal;
