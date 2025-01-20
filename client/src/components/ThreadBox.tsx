import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import DateTimeComponent from "../utills/DateTimeComponent";
import { Thread } from "../pages/home";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../App";
import { getToken } from "../utills/LocalStorage";

interface ThreadBoxProp {
  thread: Thread;
  editable?: boolean;
}

const ThreadBox = ({ thread, editable = false }: ThreadBoxProp) => {
  const navigate = useNavigate();
  const token = getToken();

  const handleDelete = async () => {
    try {
      const response = await fetch(BASE_URL + "/threads/" + thread.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      navigate(0);
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <Card sx={{ mt: 1, p: 2, width: "30%", height: "auto", display: "block" }}>
      <CardHeader
        title={
          <Typography fontSize={"100%"} fontWeight={"bold"}>
            {thread.author}
          </Typography>
        }
        subheader={
          <Typography fontSize={"80%"} color="text.secondary">
            {DateTimeComponent(thread.created_at)}
          </Typography>
        }
        sx={{ p: 1 }}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography
          variant="h1"
          color="text.primary"
          fontWeight={"bold"}
          fontSize={"150%"}
        >
          {"#" + thread.tag + ": " + thread.title}
        </Typography>
        <Typography variant="body1" color="text.primary" fontSize={"105%"}>
          {thread.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/thread/" + thread.id)}>
          Comments
        </Button>
        {editable ? (
          <Box>
            <Button size="small" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              size="small"
              onClick={() => navigate("/edit-thread/" + thread.id)}
            >
              Edit
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  );
};

export default ThreadBox;
