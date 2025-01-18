import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getToken, getUserID } from "../contexts/LocalStorage";
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../App";

export type Tag = {
  id: number;
  tag: string;
};

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tags, settags] = useState<Tag[]>([]);
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const token = getToken();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const Fetchtags = async () => {
      try {
        const response = await fetch(BASE_URL + "/tags", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        settags(data);
      } catch (error) {
        console.log(error);
      }
    };
    Fetchtags();
  }, [token]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Forum
          </Typography>

          <Box display={"flex"} flexGrow={0}>
            <Button onClick={() => navigate("/")} color="inherit">
              Home
            </Button>
            <Button
              id="categories"
              aria-controls={open1 ? "Categories-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open1 ? "true" : undefined}
              onClick={(e) => setAnchorEl1(e.currentTarget)}
              color="inherit"
            >
              Categories
            </Button>
            <Menu
              id="categories-menu"
              aria-labelledby="categories"
              anchorEl={anchorEl1}
              open={open1}
              onClose={() => setAnchorEl1(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {" "}
              {tags.map((tag) => (
                <MenuItem
                  key={tag.id}
                  onClick={() => {
                    setAnchorEl1(null);
                    navigate("/results?tag=" + tag.tag);
                  }}
                >
                  {tag.tag}
                </MenuItem>
              ))}
            </Menu>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/new-thread");
              }}
            >
              Post Threads
            </Button>
            <Button
              id="profile"
              aria-controls={open2 ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? "true" : undefined}
              onClick={(e) => setAnchorEl2(e.currentTarget)}
              color="inherit"
            >
              Profile
            </Button>
            <Menu
              id="profile-menu"
              aria-labelledby="profile"
              anchorEl={anchorEl2}
              open={open2}
              onClose={() => setAnchorEl2(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/my-threads/" + getUserID());
                }}
              >
                My Post
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
