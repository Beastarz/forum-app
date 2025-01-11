import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ThreadBox from "../components/ThreadBox";
import { BASE_URL } from "../App";

export type Thread = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  tag: string;
};

const Home = () => {
  const [threads, setthread] = useState<Thread[]>([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const FetchThreads = async () => {
      try {
        const response = await fetch(BASE_URL + "/threads", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/JSON",
          },
        });
        const data = await response.json();
        setthread(data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchThreads();
  }, []);

  return (
    <div>
      <Navbar />
      <Paper elevation={0} sx={{ width: "100%", mt: 12, p: 2 }}>
        {threads ? (
          <Stack spacing={3} justifyContent={"center"} alignItems={"center"}>
            {threads.map((thread) => (
              <ThreadBox thread={thread} key={thread.id} />
            ))}
          </Stack>
        ) : (
          <Box>
            <Typography variant="h2">No threads here...</Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Home;
