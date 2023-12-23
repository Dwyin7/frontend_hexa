import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, Button, FormControl, FormLabel, Input, Select, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { baseUrl, parseJwt } from '../util';

export const CourseModal = ({ isOpen, onClose }) => {
    let token = localStorage.getItem("token")
    const [email, setEmail] = useState(parseJwt(token)['email']);
    const [semester, setSemester] = useState('');
    const [track, setTrack] = useState('');
    const [courseOne, setCourseOne] = useState('');
    const [courseTwo, setCourseTwo] = useState('');
    const [courseThree, setCourseThree] = useState('');
    const [courseFour, setCourseFour] = useState('');
    const toast = useToast();

    const semesters = ['2020 Spring', '2020 Summer', '2020 Fall', '2021 Spring', '2021 Summer', '2021 Fall', '2022 Spring', '2022 Summer', '2022 Fall', '2023 Spring', '2023 Summer', '2023 Fall', '2024 Spring', '2024 Summer', '2024 Fall', '2025 Spring', '2025 Summer', '2025 Fall'];
    const tracks = ['DataScience', 'SoftwareDevelopment', 'SystemsEngineering', 'GameDesign', 'UserInterfaceDesign'];
    const courses = ['ComputerArchitecture', 'DataStructures', 'IntroToCompSci', 'HumanComputerInteraction', 'CyberSecurity', 'Calculus', 'WebDevelopment', 'CloudComputing', 'GameDevelopment', 'OperatingSystems', 'LinearAlgebra', 'Statistics', 'Networks', 'Algorithms', 'MobileAppDevelopment', 'MachineLearning', 'DatabaseSystems', 'Graphics', 'AI', "SoftwareEngineering"];

    const checkCourseFulfillment = async (email, course) => {
        try {
            const response = await axios.get(`${baseUrl}/check_student_course_fufillment`, {
                params: { email, target_course: course }
            });
            return response.data.message.msg; // Assuming response.data indicates if the course can be taken
        } catch (error) {
            console.error("Error checking course fulfillment:", error);
            return false;
        }
    };

    const handleSubmit = async () => {
        // Filter out empty or null courses
        const coursesToCheck = [courseOne, courseTwo, courseThree, courseFour].filter(course => course);

        // Check prerequisites for non-empty courses
        const checks = await Promise.all(coursesToCheck.map(course =>
            checkCourseFulfillment(email, course)
        ));

        // Proceed only if all checked courses are fulfilled
        if (checks.every(result => result === true)) {
            const params = new URLSearchParams({
                email,
                semester,
                track,
                courseOne,
                courseTwo,
                courseThree,
                courseFour
            }).toString();

            const urlWithParams = `${baseUrl}/add_course?${params}`;

            axios.post(urlWithParams)
                .then(response => {
                    toast({
                        title: "Course Added",
                        description: "The courses have been successfully added.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose(); // Close the modal
                })
                .catch(error => {
                    toast({
                        title: "Error",
                        description: "Duplicate semester",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
        } else {
            toast({
                title: "Prerequisite Check Failed",
                description: "One or more courses do not fulfill prerequisites.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };




    const courseFields = [
        { label: 'Course One', value: courseOne, setValue: setCourseOne },
        { label: 'Course Two', value: courseTwo, setValue: setCourseTwo },
        { label: 'Course Three', value: courseThree, setValue: setCourseThree },
        { label: 'Course Four', value: courseFour, setValue: setCourseFour }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Student History</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Semester</FormLabel>
                        <Select placeholder="Select semester" value={semester} onChange={(e) => setSemester(e.target.value)}>
                            {semesters.map(semester => (
                                <option key={semester} value={semester}>{semester}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl isRequired mt={4}>
                        <FormLabel>Track</FormLabel>
                        <Select placeholder="Select track" value={track} onChange={(e) => setTrack(e.target.value)}>
                            {tracks.map(track => (
                                <option key={track} value={track}>{track}</option>
                            ))}
                        </Select>
                    </FormControl>
                    {courseFields.map((field, index) => (
                        <FormControl isRequired mt={4} key={index}>
                            <FormLabel>{field.label}</FormLabel>
                            <Select
                                placeholder={`Select ${field.label}`}
                                value={field.value}
                                onChange={(e) => field.setValue(e.target.value)}
                            >
                                {courses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
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
