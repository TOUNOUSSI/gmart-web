import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../models/user.model";
import { AppComponent } from "../../app.component";
import { Observable, throwError } from "rxjs";
import "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  API_GATEWAY_URL,
  CORE_FRIEND_URN,
} from "src/app/configs/global-variables";

@Injectable()
export class AccountService {
  userAuth: User;
  errorMessage: string;
  constructor(private https: HttpClient) {}
  getUser(): Observable<any> {
    return this.https.get(API_GATEWAY_URL + "/account/getUser").pipe(
      map((response: any) => response),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getSearchUsersList(criteria: string): Observable<any> {
    return this.https
      .get(API_GATEWAY_URL + CORE_FRIEND_URN + "/find-friends/" + criteria)
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  resetPassword(mail: string) {
    return this.https
      .post(API_GATEWAY_URL + "/account/resetPassword", mail)
      .toPromise()
      .then((response: Response) => response)
      .catch((error) => {});
  }

  getAllAccounts(): Observable<User[]> {
    return this.https
      .get<User[]>(API_GATEWAY_URL + "/gmartws-core-account/all")
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  // This function is used for updating user data
  updateAccount(user: User) {
    return this.https
      .put(API_GATEWAY_URL + "/account/edit", user)
      .toPromise()
      .then((response: Response) => response)
      .catch((error) => {
        return throwError(error);
      });
  }

  removeAccount(id: string) {
    return this.https
      .post(API_GATEWAY_URL + "/account/delete/", id)
      .toPromise()
      .then((response: Response) => response)
      .catch((error) => {
        return throwError(error);
      });
  }

  //Function used to switch the account activation state
  switchState(id: string) {
    return this.https
      .patch(API_GATEWAY_URL + "/account/switchActivationState", id)
      .toPromise()
      .then((response: Response) => response)
      .catch((error) => {
        return throwError(error);
      });
  }
}
