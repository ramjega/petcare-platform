import React from "react";
import { Box, Container } from "@mui/material";

const Layout = ({ children }) => {
    return (
        <Box>
            <Container
                maxWidth="lg"
                sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                {children}
            </Container>
        </Box>
    );
};

export default Layout;