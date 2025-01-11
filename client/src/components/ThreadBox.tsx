import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import DateTimeComponent from "./DateTimeComponent";
import { Thread } from "../pages/home";
import { useNavigate } from "react-router-dom";

const ThreadBox = ({ thread }: { thread: Thread }) => {
  const navigate = useNavigate();
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
      </CardActions>
    </Card>
  );
};

export default ThreadBox;
