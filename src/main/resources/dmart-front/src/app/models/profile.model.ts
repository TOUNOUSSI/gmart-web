import { Picture } from "./picture.model";
import { Post } from "./post.model";
export class Profile {
  pseudoname: string;
  username: string;
  firstname: string;
  lastname: string;
  nickname: string;
  phone: string;
  avatarPayload: string;
  pictures: Array<Picture> = new Array();
  posts: Array<Post> = new Array();
  profileDescription: string;
}
