import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PushNotificationComponent } from "./push-notification.component";

@NgModule({
  declarations: [PushNotificationComponent],
  imports: [CommonModule],
  exports: [PushNotificationComponent],
})
export class PushNotificationModule {}
