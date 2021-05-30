import { Profile } from "./profile.model";

export class Comment {
  id: string;
  value: string;
  commentDate: Date;
  pseudoname: string;
  commenterProfile: Profile;
}
