import {
  Box,
  Button,
  Card,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME, BASE_URL } from "../App";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(BASE_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("username has already registered");
        throw new Error(data.message);
      }
      alert("register successful");
      navigate("/login");
    } catch (error) {
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
          <Card sx={{ p: 2, mt: 50, pt: 3, pb: 3 }}>
            <Box>
              <Typography variant="h6">{APP_NAME}</Typography>
            </Box>
            <Typography variant="h5" fontSize={"200%"}>
              Register
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
                Register
              </Button>
              <Button
                onClick={() => {
                  navigate("/login");
                }}
              >
                Click Here To Login Page
              </Button>
            </form>
          </Card>
        )}
      </Paper>
    </div>
  );
};

export default RegisterForm;
