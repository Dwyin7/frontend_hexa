import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Heading, List, ListItem, Text, Badge, Flex, Select, Divider, Stack, Button, useDisclosure } from "@chakra-ui/react";
import { CommentsModal } from './CommentsModal';
import { parseJwt } from '../util';
import { baseUrl } from '../util';
function ReviewList(props) {
    let token = localStorage.getItem("token")
    let decodedToken = parseJwt(token)
    let role = decodedToken['role']
    let pv = props['pv']
    console.log("contents token: ", token)
    console.log("decoded token: ", decodedToken)
    console.log("role :", role)
    console.log("props :", props)

    const [reviews, setReviews] = useState([]);
    const [selectedPinned, setSelectedPinned] = useState('');
    const [selectedCourseName, setSelectedCourseName] = useState('');
    const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
    const [selectedInstructorName, setSelectedInstructorName] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModesOfInstruction, setSelectedModesOfInstruction] = useState('');
    const [selectedOverallRating, setSelectedOverallRating] = useState('');
    const [selectedContents, setSelectedContents] = useState('');
    const [selectedShown, setSelectedShown] = useState(pv ? 0 : 1);
    console.log("Shown: ", selectedShown)

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; // Adjust this value based on your preference
    const totalRecords = reviews.length;

    const pages = Math.ceil(totalRecords / reviewsPerPage);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    // ... existing buildQueryString and useEffect functions
    const courseNames = [
        "ComputerArchitecture",
        "DataStructures",
        "IntroToCompSci",
        "HumanComputerInteraction",
        "CyberSecurity",
        "Calculus",
        "SoftwareEngineering",
        "WebDevelopment",
        "CloudComputing",
        "GameDevelopment",
        "OperatingSystems",
        "LinearAlgebra",
        "Statistics",
        "Networks",
        "Algorithms",
        "MobileAppDevelopment",
        "MachineLearning",
        "DatabaseSystems",
        "Graphics",
        "AI"
    ];
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [selectedCommentUserId, setselectedCommentUserId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOpenComments = (reviewId, userId) => {
        setSelectedReviewId(reviewId);
        setselectedCommentUserId(userId);
        onOpen();
    };
    const handlePass = (reviewId, shown, pinned) => {
        const updateData = {
            review_id: reviewId,
            shown: shown,
            pinned: pinned,
        };

        axios.put(baseUrl + "/update_review", updateData)
            .then(response => {
                console.log("Review updated successfully:", response.data);
                // Perform any additional actions if needed
                const queryParams = buildQueryString({
                    per_page: 1000,
                    pinned: selectedPinned,
                    course_name: selectedCourseName,
                    course_number: selectedCourseNumber,
                    instructor_name: selectedInstructorName,
                    department: selectedDepartment,
                    term: selectedTerm,
                    year: selectedYear,
                    modes_of_instruction: selectedModesOfInstruction,
                    overall_rating: selectedOverallRating,
                    shown: selectedShown
                });
                console.log("queryParam: ", queryParams)
                axios.get(`${baseUrl}/get_reviews?${queryParams}`)
                    .then(response => {
                        setReviews(response.data.data);
                    })
                    .catch(error => {
                        console.error("Error fetching data: ", error);
                    });
            })
            .catch(error => {
                console.error("Error updating review:", error);
                // Handle error appropriately
            });
    };
    const handleDelete = (reviewId) => {
        console.log("review_id: ", reviewId)
        let deleteData = {
            review_id: reviewId
        };

        console.log("deleteData: ", deleteData)

        axios.delete(baseUrl + "/delete_review", { data: deleteData })
            .then(response => {
                console.log("Review deleted successfully:", response.data);
                // Perform any additional actions if needed
                const queryParams = buildQueryString({
                    per_page: 1000,
                    pinned: selectedPinned,
                    course_name: selectedCourseName,
                    course_number: selectedCourseNumber,
                    instructor_name: selectedInstructorName,
                    department: selectedDepartment,
                    term: selectedTerm,
                    year: selectedYear,
                    modes_of_instruction: selectedModesOfInstruction,
                    overall_rating: selectedOverallRating,
                    shown: selectedShown
                });
                console.log("queryParam: ", queryParams)
                axios.get(`${baseUrl}/get_reviews?${queryParams}`)
                    .then(response => {
                        setReviews(response.data.data);
                    })
                    .catch(error => {
                        console.error("Error fetching data: ", error);
                    });
            })
            .catch(error => {
                console.error("Error deleting review:", error);
                // Handle error appropriately
            });
    };


    // Function to build query string with non-empty parameters
    const buildQueryString = (params) => {
        return Object.keys(params)
            .filter(key => params[key] !== '' && params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    };

    useEffect(() => {
        const queryParams = buildQueryString({
            per_page: 1000,
            pinned: selectedPinned,
            course_name: selectedCourseName,
            course_number: selectedCourseNumber,
            instructor_name: selectedInstructorName,
            department: selectedDepartment,
            term: selectedTerm,
            year: selectedYear,
            modes_of_instruction: selectedModesOfInstruction,
            overall_rating: selectedOverallRating,
            shown: selectedShown
        });
        console.log("queryParam: ", queryParams)
        axios.get(`${baseUrl}/get_reviews?${queryParams}`)
            .then(response => {
                setReviews(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }, [
        selectedPinned, selectedCourseName, selectedCourseNumber, selectedInstructorName,
        selectedDepartment, selectedTerm, selectedYear, selectedModesOfInstruction,
        selectedOverallRating, selectedShown
    ]);

    console.log("reviews: ", reviews)
    return (
        <Box p={5} shadow="md" borderWidth="1px">
            <Heading mb={4}>Reviews</Heading>
            <Stack spacing={4} direction={["column", "row"]} wrap="wrap" justify="space-between" mb={4} p={1}>
                <Box width={["100%", "200px"]}>
                    <Select placeholder="Pinned" value={selectedPinned} onChange={(e) => setSelectedPinned(e.target.value)}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </Select>
                </Box>
                <Box width={["100%", "200px"]}>
                    <Select placeholder="Select Course" value={selectedCourseName} onChange={(e) => setSelectedCourseName(e.target.value)}>
                        {courseNames.map(courseName => (
                            <option key={courseName} value={courseName}>{courseName}</option>
                        ))}
                    </Select>
                </Box>
                <Box width={["100%", "200px"]}>
                    <Select placeholder="Select Term" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                    </Select>
                </Box>
                <Box width={["100%", "200px"]}>
                    <Select placeholder="Select Year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </Select>
                </Box>
                <Box width={["100%", "200px"]}>
                    <Select placeholder="Modes of Instruction" value={selectedModesOfInstruction} onChange={(e) => setSelectedModesOfInstruction(e.target.value)}>
                        <option value="In-Person">In-Person</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Online only">Online only</option>
                    </Select>
                </Box>
            </Stack>
            <Divider mb={4} />

            <List spacing={3}>
                {currentReviews.map((review, index) => (
                    <ListItem key={index} p={3} borderWidth="1px" borderRadius="lg">
                        <Text fontWeight="bold">{review.course_name} - {review.course_number}</Text>
                        <Text fontStyle="italic">Instructor: {review.instructor_name}</Text>
                        <Text>Department: {review.department}</Text>
                        <Badge colorScheme={review.overall_rating >= 4 ? "green" : "red"}>
                            Rating: {review.overall_rating}
                        </Badge>
                        <Text mt={2}>{review.contents}</Text>
                        <Flex justify="space-between" mt={4}>
                            <Flex gap={5}> {/* Adjust the margin left as needed */}
                                <Button onClick={() => { handleOpenComments(review.review_id, review.user_id); console.log(review, "rid") }}>View Comments</Button>
                                {role == "admin" && <Button onClick={() => { handlePass(review.review_id, review.shown, review.pinned^1); console.log(review.pinned, "rid") }}>{review.pinned == 1 ? "unpined" : "pinned"}</Button>
                                }
                                {pv ? ( // Conditionally render "Pass" and "Delete" buttons based on pv value
                                    <>
                                        <Button onClick={() => { handlePass(review.review_id, 1, review.pinned); console.log(review, "rid") }}>Pass</Button>
                                        <Button onClick={() => { handleDelete(review.review_id) }}>Delete</Button>

                                    </>
                                ) : null}
                            </Flex>
                        </Flex>
                    </ListItem>
                ))}
            </List>
            <Flex justify="space-between" mt={4}>
                <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous Page
                </Button>
                <Text>{`Page ${currentPage} of ${pages}`}</Text>
                <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pages}>
                    Next Page
                </Button>
            </Flex>

            <CommentsModal reviewId={selectedReviewId} user_id={selectedCommentUserId} isOpen={isOpen} onClose={onClose} />

        </Box>

    );
}

export default ReviewList;
