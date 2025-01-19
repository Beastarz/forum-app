import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Thread } from "./home";
import { BASE_URL } from "../App";
import { getToken, getUserID } from "../contexts/LocalStorage";
import ThreadBox from "../components/ThreadBox";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const MyThreads = () => {
  const [threads, setthread] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userID = getUserID();
  const token = getToken();

  useEffect(() => {
    if (id == userID) {
      const fetchThreads = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            BASE_URL + "/threads/my-threads/" + userID,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message);
          }
          setthread(data);
        } catch (error) {
          console.log("Error fetching threads");
        } finally {
          setIsLoading(false);
        }
      };
      fetchThreads();
    } else {
      alert("unable to access");
      navigate("/");
    }
  }, [id, userID, token]);

  return (
    <div className="threads">
      <Navbar />
      <Paper elevation={0} sx={{ width: "100%", mt: 12 }}>
        <Box justifySelf={"center"}>
          <Typography variant="h4">My Post</Typography>
        </Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : threads ? (
          <Stack spacing={3} justifyContent={"center"} alignItems={"center"}>
            {threads.map((thread) => (
              <ThreadBox thread={thread} key={thread.id} editable={true} />
            ))}
          </Stack>
        ) : (
          <Box justifySelf={"center"} height={300}>
            <Typography variant="body1" fontSize={20} sx={{ pt: 3 }}>
              No Post Yet
            </Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default MyThreads;
