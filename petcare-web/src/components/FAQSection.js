import React from "react";
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQSection = () => {
    const faqs = [
        {
            question: "How do I book a service?",
            answer: "Simply navigate to the booking page, select a service, and fill out the form.",
        },
        {
            question: "Can I track my pet's health records?",
            answer: "Yes! Our platform allows you to track health records, vaccinations, and more.",
        },
        {
            question: "What payment options are available?",
            answer: "We accept credit/debit cards, online wallets, and PayPal.",
        },
    ];

    return (
        <Container sx={{ padding: 6, marginTop: 6 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                Frequently Asked Questions
            </Typography>
            {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ marginY: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};

export default FAQSection;
