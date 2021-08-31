import { Component, Input, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UserProfile } from "src/app/models/notification-profile.model";
import { NotificationDTO } from "src/app/models/notification.model";
import { DmartUtilsService } from "src/app/services/dmart-utils/dmart-utils.service";
import { MessengerService } from "src/app/services/messenger/messenger.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { PushNotificationService } from "src/app/services/push-notification/push-notification.service";

@Component({
  selector: "dmart-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  @Input()
  public pseudoname;

  @Input()
  public notifications: NotificationDTO[];

  @Input()
  public nonCheckedNotifications: NotificationDTO[];

  @Input()
  public checkedNotifications: NotificationDTO[];

  @Input()
  public counter;

  public avatarPayload: any;

  public newFriendRequestNotification: NotificationDTO;

  constructor(
    private messengerService: MessengerService,
    private profileService: ProfileService,
    private cookieService: CookieService,
    private pushNotificationService: PushNotificationService,
    private dmartUtils: DmartUtilsService
  ) { }

  ngOnInit() { }

  acceptFriendRequestFromNotification(notification: NotificationDTO) {
    let receiver = notification.sender;
    console.log(
      "Accept friend request of " + receiver.firstname + " " + receiver.lastname
    );
    this.messengerService.addFriend(receiver.pseudoname).then((resp: any) => {
      console.log(
        "Sending friend request acceptance to : " + JSON.stringify(receiver)
      );

      this.profileService
        .getCustomProfileByUsername(this.cookieService.get("__usrnm_"))
        .subscribe((sender: UserProfile) => {
          this.profileService
            .getCustomProfileByUsername(receiver.username)
            .subscribe((receiver: UserProfile) => {
              this.newFriendRequestNotification = new NotificationDTO(
                sender,
                receiver,
                "FRIEND_REQUEST_ACCEPTANCE"
              );

              this.pushNotificationService.sendFriendRequestNotification(
                this.newFriendRequestNotification
              );

              //this.updateNotificationStatus(notification.id);
              this.deleteFriendRequestNotification(notification);
            });
        });
    });
  }

  /**
   * Delete friend request notification after subbmition of acceptance ACK
   * we must update the viewed notification status to became old notification 
   * 
   * @param notificationID
   */
  deleteFriendRequestNotification(notification: NotificationDTO) {
    this.removeFriendRequestFromCheckedNotification(notification);
    this.removeFriendRequestFromNonCheckedNotification(notification);

    this.pushNotificationService
      .deleteNotification(notification.id)
      .subscribe((resp) => {
        console.log("Notification has been deleted");
      });
  }

  removeFriendRequestFromCheckedNotification(notificationDTO: NotificationDTO) {
    this.checkedNotifications = this.checkedNotifications.filter(notif => {
      notif.id === notificationDTO.id;
    });
  }

  removeFriendRequestFromNonCheckedNotification(notificationDTO: NotificationDTO) {
    this.nonCheckedNotifications = this.nonCheckedNotifications.filter(notif => {
      notif.id === notificationDTO.id;
    });
  }

  /**
   * After submitting friend request accept notification
   * we must update the viewed notification status to became old notification */
  updateNotificationStatus(notificationID: string) {
    this.pushNotificationService
      .changeNotificationStatusToOld(notificationID)
      .subscribe((resp) => {
        console.log("Notification has been viewed");
      });
  }



  /**
   * Navigate to specific url with a refresh params (used when push changes detected
   * and a navigation to the same url has been performed )
   * @param url
   */
  public navigateToUrlWithRefreshParams(url: string) {
    this.dmartUtils.loadProfileWithRefreshParams(url);
  }
}
