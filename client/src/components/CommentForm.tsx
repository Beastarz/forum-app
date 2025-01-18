import { Button, TextField } from "@mui/material";
import React, { FormEvent } from "react";
import { getToken, getUserID, getUsername } from "../contexts/LocalStorage";
import { BASE_URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const CommentForm = () => {
  const [comment, setComment] = React.useState("");
  const username = getUsername();
  const userID = getUserID();
  const token = getToken();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(BASE_URL + "/threads/comments/" + id, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          author: username,
          author_id: userID,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setComment("");
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          value={comment}
          type="text"
          placeholder="Add comment"
          onChange={(e) => setComment(e.target.value)}
          required
          multiline
          size="small"
          sx={{ width: "80%", m: 1 }}
        />
        <Button type="submit" sx={{ m: 1 }}>
          Post
        </Button>
      </form>
    </div>
  );
};

export default CommentForm;
