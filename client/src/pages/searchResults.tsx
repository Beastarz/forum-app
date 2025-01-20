import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Thread } from "./home";
import { BASE_URL } from "../App";
import { getToken } from "../utills/LocalStorage";
import ThreadBox from "../components/ThreadBox";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const SearchResults = () => {
  const [threads, setthread] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();
  const tag = useSearchParams()[0].get("tag");

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(BASE_URL + "/threads/search?tag=" + tag, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setthread(data);
      } catch {
        setError("Failed to load threads");
        setthread([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
  }, [tag, token]);
  return (
    <div className="threads">
      <Navbar />
      <Paper elevation={0} sx={{ width: "100%", mt: 12 }}>
        <Box justifySelf={"center"}>
          <Typography variant="h4">{"#" + tag}</Typography>
        </Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : threads ? (
          <Stack spacing={3} justifyContent={"center"} alignItems={"center"}>
            {threads.map((thread) => (
              <ThreadBox thread={thread} key={thread.id} />
            ))}
          </Stack>
        ) : (
          <Box justifySelf={"center"} height={300}>
            <Typography variant="body1" fontSize={20} sx={{ pt: 3 }}>
              No Post Related to #{tag} Yet
            </Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default SearchResults;
