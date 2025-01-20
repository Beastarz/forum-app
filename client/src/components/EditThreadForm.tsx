import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { BASE_URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../utills/LocalStorage";
import { Tag } from "./Navbar";

const EditThreadForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, settags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(BASE_URL + "/tags", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        settags(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchThread = async () => {
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
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.tag);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, []);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/threads/${id}`, {
        method: "Put",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          tag: category,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setTitle("");
      setContent("");
      setCategory("");
      alert("post successful!");
      navigate("/");
    } catch (error) {
      alert("Failed to post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleEdit}>
          <Box display={"flex"} flexDirection={"column"} sx={{ mt: 2 }}>
            <InputLabel id="title-label">Title</InputLabel>
            <TextField
              defaultValue={title}
              placeholder="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              multiline
              required
            />
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              defaultValue={category}
              displayEmpty
              fullWidth
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              required
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.tag}>
                  {tag.tag}
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="Content-label">Content</InputLabel>
            <TextField
              id="content"
              defaultValue={content}
              placeholder="Content"
              type="text"
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={4}
              required
            />
            <Button
              type="submit"
              sx={{ width: "10%", alignSelf: "center", pt: 2 }}
            >
              Post
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default EditThreadForm;
