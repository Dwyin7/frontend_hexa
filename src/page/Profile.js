import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { baseUrl, parseJwt } from '../util';
import { CourseModal } from '../components/CourseModal';

export default function Profile() {
    const token = localStorage.getItem("token");
    const [takenCourses, setTakenCourses] = useState([]);
    const [studentHistoryResponse, setStudentHistoryResponse] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toast = useToast();

    const fetchAllTakenCourses = () => {
        axios.get(`${baseUrl}/get_student_taken_courses?email=${parseJwt(token)['email']}`)
            .then(response => {
                setTakenCourses(response.data.message.get_student_history);
            })
            .catch(error => {
                console.error("Error fetching taken courses:", error);
            });
    };

    const fetchStudentInfo = () => {
        axios.get(`${baseUrl}/get_student_recommendations?email=${parseJwt(token)['email']}`)
            .then(response => {
                setStudentHistoryResponse(response.data.message.get_student_history.response_data);
            })
            .catch(error => {
                console.error("Error fetching student info:", error);
            });
    };

    const removeSemester = (id) => {
        axios.delete(`${baseUrl}/remove_course?id=${id}`)
            .then(response => {
                toast({
                    title: "Semester Removed",
                    description: "The semester has been successfully removed.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setStudentHistoryResponse(current => current.filter(resp => resp.id !== id));
            })
            .catch(error => {
                toast({
                    title: "Error",
                    description: "There was an error removing the semester.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    useEffect(() => {
        fetchAllTakenCourses();
        fetchStudentInfo();
    }, []); // Empty dependency array ensures this runs once on component mount

    return (
        <>
            <Heading> Taken Courses </Heading>
            {takenCourses.map((course, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text mt={2}>{course}</Text>
                </Box>
            ))}

            <Heading> Semester Detail </Heading>
            {studentHistoryResponse.map((resp, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text mt={2}>Semester: {resp.semester}</Text>
                    <Text mt={2}>Track: {resp.track}</Text>
                    <Box borderWidth={3} borderRadius={5} p={2}>
                        <Text mt={2}>Course One: {resp.courseOne}</Text>
                        <Text mt={2}>Course Two: {resp.courseTwo}</Text>
                        <Text mt={2}>Course Three: {resp.courseThree}</Text>
                        <Text mt={2}>Course Four: {resp.courseFour}</Text>
                    </Box>
                    <Button mt={4} colorScheme="red" onClick={() => removeSemester(resp.id)}>
                        Remove Semester
                    </Button>
                </Box>
            ))}

            <div>
                <Button onClick={openModal}>Add Course</Button>
                <CourseModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
        </>
    );
}
