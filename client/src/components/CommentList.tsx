import CommentBox from "./CommentBox";
import { Comment } from "../pages/thread";
import DateTimeComponent from "./DateTimeComponent";

const CommentList = ({ comments }: { comments: Comment[] }) => {
  if (!comments) {
    return <div>No comments yet!</div>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentBox
          author={comment.author}
          content={comment.content}
          created_at={DateTimeComponent(comment.created_at)}
          key={comment.id}
        />
      ))}
    </div>
  );
};

export default CommentList;
