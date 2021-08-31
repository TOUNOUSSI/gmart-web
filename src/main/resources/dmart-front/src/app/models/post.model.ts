import { Comment } from "./comment.model";
import { Picture } from "./picture.model";
import { Reaction } from "./reaction.model";

export class Post {
  id: string;
  type: string;
  postDate: Date;
  description: string;
  pictures: Array<Picture>;
  comments: Array<Comment>;
  reactions: Array<Reaction>;
}
