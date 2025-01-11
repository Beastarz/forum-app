import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { getUsername, getToken } from "./LocalStorage";
import { Tag } from "./Navbar";

const NewThreadForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, settags] = useState<Tag[]>([]);
  const username = getUsername();
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(BASE_URL + "/tags", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      settags(data);
    };
    fetchTags();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/threads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          author: username,
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
      navigate("/");
    } catch (error) {
      alert("Failed to post");
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box display={"flex"} flexDirection={"column"} sx={{ mt: 2 }}>
          <InputLabel id="title-label">Title</InputLabel>
          <TextField
            value={title}
            placeholder="Title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            multiline
            required
          />
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            fullWidth
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
            value={content}
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
    </div>
  );
};

export default NewThreadForm;
