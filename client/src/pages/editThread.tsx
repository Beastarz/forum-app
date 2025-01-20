import { Paper, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import EditThreadForm from "../components/EditThreadForm";

const EditThread = () => {
  return (
    <div>
      <Navbar />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 20 }}>
        <Typography variant="h5"> Edit Thread</Typography>
        <EditThreadForm />
      </Paper>
    </div>
  );
};

export default EditThread;
