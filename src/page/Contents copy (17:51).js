import React, { useState } from 'react';
import ReviewList from '../components/ReviewList';
import { parseJwt } from '../util';
import Banner from '../components/Banner';
import ReviewModal from '../components/ReviewModal';
import { Button } from '@chakra-ui/react';
export default function Contents() {
    let token = localStorage.getItem("token")
    console.log("contents token", token)
    console.log("decoded token :", parseJwt(token))
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    return (<>
        <Button onClick={() => setIsModalOpen(true)}>Leave a Review</Button>
        <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            courseNames={courseNames}
        />
        <ReviewList></ReviewList>

    </>)
}