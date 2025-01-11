import { Paper, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import NewThreadForm from "../components/NewThreadForm";

const NewThread = () => {
  return (
    <div>
      <Navbar />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 12 }}>
        <Typography variant="h5">Create New Post</Typography>
        <NewThreadForm />
      </Paper>
    </div>
  );
};

export default NewThread;
