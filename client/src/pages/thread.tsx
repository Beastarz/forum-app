import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getToken } from "../utills/LocalStorage";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import DateTimeComponent from "../utills/DateTimeComponent";
import { BASE_URL } from "../App";

export type Comment = {
  id: number;
  thread_id: number;
  content: string;
  author_id: number;
  created_at: string;
  author: string;
};

export type ThreadView = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  comments: Comment[];
};

const Thread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [threadview, setthreadview] = useState<ThreadView>({
    id: -1,
    title: "",
    content: "",
    author: "",
    created_at: "",
    comments: [],
  });

  const token = getToken();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const FetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(BASE_URL + "/threads/view/" + id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setthreadview(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    FetchComments();
  }, []);

  return (
    <div>
      <Navbar />
      <Paper
        elevation={0}
        sx={{
          mt: 12,
          p: 2,
          width: "70%",
          justifyItems: "center",
          justifySelf: "center",
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ width: "65%" }}>
            <CardHeader
              title={
                <Typography fontSize={"100%"} fontWeight={"bold"}>
                  {threadview.author}
                </Typography>
              }
              subheader={
                <Typography fontSize={"80%"} color="text.secondary">
                  {DateTimeComponent(threadview.created_at)}
                </Typography>
              }
            />
            <CardContent sx={{ mt: -3 }}>
              <Typography
                variant="h1"
                color="text.primary"
                fontWeight={"bold"}
                fontSize={"150%"}
              >
                {threadview.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                fontSize={"110%"}
              >
                {threadview.content}
              </Typography>
            </CardContent>
            <CommentForm />
          </Card>
        )}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ width: "65%", p: 0, mt: 2 }}>
            <CardHeader
              title={`Comments (${
                threadview.comments ? threadview.comments.length : 0
              })`}
            />
            <CardContent>
              <CommentList comments={threadview.comments} />
            </CardContent>
          </Card>
        )}
      </Paper>
    </div>
  );
};

export default Thread;
