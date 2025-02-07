import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // New state for loading
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await axios.post("http://localhost:5003/api/users/register", formData);
            setSuccess(response.data.message);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh", // Ensure the form is centered vertically
                }}
            >
                <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white", width: "100%" }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Username" name="username" margin="normal" required onChange={handleChange} />
                        <TextField fullWidth label="Email" name="email" margin="normal" required onChange={handleChange} />
                        <TextField fullWidth label="Password" name="password" type="password" margin="normal" required onChange={handleChange} />
                        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Register"}
                        </Button>
                    </form>
                    <Typography sx={{ mt: 2, textAlign: "center" }}>
                        Already have an account? <Button onClick={() => navigate("/login")}>Login</Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;