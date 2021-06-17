import { UserProfile } from "./notification-profile.model";

export class NotificationDTO {
  id: string;
  title: string;
  body: string;
  sender: UserProfile;
  receiver: UserProfile;
  type: string;
  checked: boolean;
  data: {
    url: string;
  };

  public constructor(sender: UserProfile, receiver: UserProfile, type: string) {
    this.type = type;
    this.receiver = receiver;
    this.sender = sender;

    switch (type) {
      case "FRIEND_REQUEST":
        this.title = "Friend request notification";
        this.body =
          this.sender.firstname +
          " " +
          this.sender.lastname +
          " sent you a friend request";
        this.data = { url: "/admin/profile/" + this.sender.pseudoname };
        break;
      case "FRIEND_REQUEST_ACCEPTANCE":
        this.title = "New friend notification";
        this.body =
          this.sender.firstname +
          " " +
          this.sender.lastname +
          " accepted your friend request";
        this.data = { url: "/admin/profile/" + this.sender.pseudoname };

        break;
      case "FRIEND_NEW_COMMENT":
        this.title = "New comment notification";
        this.body = " New comment done on post by " + this.sender;
        break;
      case "FRIEND_NEW_POST":
        this.title = "New post notification";
        this.body = " New post dropped off by " + this.sender;
        break;
      case "FRIEND_LIVE_VIDEO":
        this.title = "Live video started";
        this.body = this.sender + " started a live video ";
        break;
      case "FRIEND_NEW_REEL":
        this.title = "New reel notification";
        this.body = " New reel dropped off by " + this.sender;
        break;
      default:
        this.title = "Friend request notification";
        this.body =
          this.sender.firstname +
          " " +
          this.sender.lastname +
          " sent you a friend request";
        break;
    }
  }
}
