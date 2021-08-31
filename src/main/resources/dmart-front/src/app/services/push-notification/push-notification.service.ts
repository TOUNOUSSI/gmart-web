import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import {
  API_GATEWAY_URL,
  PUSH_NOTIFICATION_URN,
} from "../../configs/global-variables";
import { SnackbarService } from "../notifications/toaster/snackbar.service";
import { NotificationDTO } from "src/app/models/notification.model";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { UserProfile } from "src/app/models/notification-profile.model";

@Injectable({
  providedIn: "root",
})
export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY =
    "BDP5Yxt1ct50e4ai_Ucyy54X7mmme5Hmv3HYK2eSTo8aCHSO_I-Sd7UUV8lHBvRV5yxhaMXuvVJOt4yS70c3wgY";

  private stompClient;

  fromUser: string = localStorage.getItem("Currentuser");
  topic: string = "";

  messageSource: BehaviorSubject<number> = new BehaviorSubject(0);

  public message: any;

  //This is used for listing all notifications
  public notificationsBehaviorSubject: BehaviorSubject<NotificationDTO> =
    new BehaviorSubject(
      new NotificationDTO(new UserProfile(), new UserProfile(), "")
    );

  constructor(
    private https: HttpClient,
    private toasterService: SnackbarService
  ) { }

  getAllNotifications(username: string): Observable<any> {
    return this.https
      .get(API_GATEWAY_URL + PUSH_NOTIFICATION_URN + "/all/" + username)
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  /**
   * Used to Send Push Notification of Type Friend Request
   * @param param0
   * @returns
   */
  public sendFriendRequestNotification(notification: NotificationDTO) {
    console.log("Notification to be sent :");
    this.stompClient.debug = null;
    let token = localStorage.getItem("Token");
    this.stompClient.send(
      "/ws/send/push-notification",
      {
        Authorization: "GMART_AUTHORIZATION " + token,
        Token: token,
      },
      JSON.stringify(notification)
    );
  }

  /**
   * Delete notification based on notificationID
   * @param notificationID
   * @returns
   */
  public deleteNotification(notificationID: string): Observable<any> {
    return this.https
      .delete(
        API_GATEWAY_URL + PUSH_NOTIFICATION_URN + "/delete/" + notificationID
      )
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  /**
   *
   * @param notificationID
   * @returns
   */
  public changeNotificationStatusToOld(
    notificationID: string
  ): Observable<any> {
    return this.https
      .put(API_GATEWAY_URL + PUSH_NOTIFICATION_URN + "/viewed", notificationID)
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  /**
   * Used to initialize the WS
   */
  initializeWebSocketConnection(channelName: string) {
    //http://localhost:9091/gmart-chat-ws/gmart-chat-ws
    let sockJsProtocols = ["xhr-streaming", "xhr-polling"];

    let ws = new SockJS(API_GATEWAY_URL + PUSH_NOTIFICATION_URN, null, {
      transports: sockJsProtocols,
    });
    this.stompClient = Stomp.over(ws);
    //this.stompClient.debug = null;
    let that = this;
    this.stompClient.connect({}, (frame) => {
      //console.log(this.stompClient._transport.url);
      this.topic = "/topic/private-notification-channel-of-" + channelName;
      that.stompClient.subscribe(this.topic, (message) => {
        if (message.body) {
          setTimeout(() => {
            this.pushNotificationToView(JSON.parse(message.body));
          }, 1000);
        }
      });
    });
  }

  public pushNotificationToView(notification: NotificationDTO) {
    console.log(
      "Notification received content :  " + JSON.stringify(notification)
    );

    this.notificationsBehaviorSubject.next(notification);

    this.messageSource.next(1);
    this.toasterService.message = notification.body;
    this.toasterService.open();
  }
}
