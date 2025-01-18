import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button, Card, Paper, TextField, Typography } from "@mui/material";

function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username);
    } catch (error) {
      alert("you are not registered");
      console.error(error);
    }
  };

  return (
    <div>
      <Paper sx={{ justifySelf: "center", mt: 12 }} elevation={0}>
        <Card sx={{ p: 2, mt: 25, pt: 3, pb: 3 }}>
          <Box>
            <Typography variant="h6">Forum</Typography>
          </Box>
          <Typography variant="h5" fontSize={"200%"}>
            Log in
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button type="submit" sx={{ p: 2 }}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Click Here to Register
            </Button>
          </form>
        </Card>
      </Paper>
    </div>
  );
}

export default LoginForm;
