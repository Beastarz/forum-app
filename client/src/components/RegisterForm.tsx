import { Box, Button, Card, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../App";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
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
      alert("success");
      navigate("/login");
    } catch (error) {
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
      </Paper>
    </div>
  );
};

export default RegisterForm;
