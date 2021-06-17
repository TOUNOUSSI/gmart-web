import { Comment } from "./comment.model";
import { Reaction } from "./reaction.model";

export class Post {
  id: string;
  type: string;
  postDate: Date;
  description: string;
  comments: Array<Comment>;
  reactions: Array<Reaction>;
}
