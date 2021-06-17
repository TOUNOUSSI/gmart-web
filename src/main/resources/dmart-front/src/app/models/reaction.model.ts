import { Profile } from "./profile.model";

export class Reaction {
  id: string;
  reactingProfile: Profile;
  totalReactions: number;
}
