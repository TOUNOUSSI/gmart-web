import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { PushNotificationService } from "../../../services/push-notification/push-notification.service";

@Component({
  selector: "dmart-push-notification",
  templateUrl: "./push-notification.component.html",
  styleUrls: ["./push-notification.component.scss"],
})
export class PushNotificationComponent implements OnInit {
  constructor(private swPush: SwPush) {}
  ngOnInit() {}

  isEnabled = this.swPush.isEnabled;
  isGranted = Notification.permission === "granted";

  submitNotification(): void {
    console.log("notification submitted");
  }
}
