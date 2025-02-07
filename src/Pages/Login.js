import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true); 

        try {
            const response = await axios.post("http://localhost:5003/api/users/login", formData);
            setSuccess(response.data.message);
            localStorage.setItem("user", JSON.stringify(response.data.user)); 
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh", 
                }}
            >
                <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white", width: "100%" }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Email" name="email" margin="normal" required onChange={handleChange} />
                        <TextField fullWidth label="Password" name="password" type="password" margin="normal" required onChange={handleChange} />
                        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                    </form>
                    <Typography sx={{ mt: 2, textAlign: "center" }}>
                        Don't have an account? <Button onClick={() => navigate("/register")}>Register</Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;