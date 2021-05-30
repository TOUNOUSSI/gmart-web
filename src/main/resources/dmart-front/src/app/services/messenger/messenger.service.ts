import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SnackbarService } from "../notifications/toaster/snackbar.service";
import {
  API_GATEWAY_URL,
  CORE_FRIEND_URN,
} from "src/app/configs/global-variables";

@Injectable({
  providedIn: "root",
})
export class MessengerService {
  constructor(
    public https: HttpClient,
    private toasterService: SnackbarService
  ) {}
  getFriends() {
    return this.https
      .get(API_GATEWAY_URL + CORE_FRIEND_URN + "/myfriends")
      .toPromise()
      .then((response: Response) => response);
  }

  addFriend(pseudoname: string) {
    console.log(
      API_GATEWAY_URL + CORE_FRIEND_URN + "/add-new-friend/" + pseudoname
    );
    return this.https
      .put(
        API_GATEWAY_URL + CORE_FRIEND_URN + "/add-new-friend/" + pseudoname,
        null
      )
      .toPromise()
      .then((response: Response) => response);
  }

  AreWeAlreadyFriend(pseudoname: string) {
    console.log(
      API_GATEWAY_URL +
        CORE_FRIEND_URN +
        "/are-we-already-friends/" +
        pseudoname
    );
    return this.https
      .get(
        API_GATEWAY_URL +
          CORE_FRIEND_URN +
          "/are-we-already-friends/" +
          pseudoname
      )
      .toPromise()
      .then((response: Response) => response);
  }
}
