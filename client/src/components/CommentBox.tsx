import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import DateTimeComponent from "./DateTimeComponent";

interface CommentBox {
  author: string;
  content: string;
  created_at: string;
}
const CommentBox: React.FC<CommentBox> = ({ author, content, created_at }) => {
  return (
    <Card
      sx={{
        mt: -2,
        mb: 3,
        p: 2,
        width: "90%",
        height: "auto",
        display: "block",
      }}
    >
      <CardHeader
        title={
          <Typography fontSize={"110%"} fontWeight={"bold"}>
            {author}
          </Typography>
        }
        subheader={
          <Typography fontSize={"80%"} color="text.secondary">
            {DateTimeComponent(created_at)}
          </Typography>
        }
        sx={{ p: 1 }}
      />
      <CardContent sx={{ p: 1, mb: -2 }}>
        <Typography
          variant="body1"
          color="text.primary"
          component={"span"}
          fontSize={"110%"}
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CommentBox;
