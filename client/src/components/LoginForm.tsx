import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { APP_NAME } from "../App";

function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await login(username);
    } catch (error) {
      alert("you are not registered");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Paper sx={{ justifySelf: "center", mt: 12 }} elevation={0}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4} m={50}>
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ p: 2, m: 50, pt: 3, pb: 3 }}>
            <Box>
              <Typography variant="h6">{APP_NAME}</Typography>
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
        )}
      </Paper>
    </div>
  );
}

export default LoginForm;
