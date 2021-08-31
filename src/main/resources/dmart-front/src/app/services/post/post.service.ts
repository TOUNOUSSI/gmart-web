import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  API_GATEWAY_URL,
  CORE_ACCOUNTS_URN,
  CORE_POST_URN,
} from "src/app/configs/global-variables";
import { Post } from "src/app/models/post.model";
import { SnackbarService } from "../notifications/toaster/snackbar.service";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(
    public https: HttpClient,
    private toasterService: SnackbarService
  ) { }

  getAllRecentPosts(): Observable<any> {
    return this.https
      .get<Post[]>(API_GATEWAY_URL + CORE_POST_URN + "/all-recent-posts")
      .pipe(
        map((response: any) => response),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  save(post: Post, fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    formData.append("post", JSON.stringify(post));

    return this.https
      .post(API_GATEWAY_URL + CORE_POST_URN + "/add-new-post",
        formData)
      .pipe(
        tap((response: any) => {
          this.toasterService.message = "Le Post a été ajouté avec succèes";
          this.toasterService.open();
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 404: {
                this.toasterService.message =
                  "Impossible de se connecter au serveur";
                break;
              }
              case 400:
              case 401:
              case 403:
              case 405: {
                this.toasterService.message =
                  "Vous avez pas le droit d'accèder à cette ressource";
                break;
              }
              default: {
                this.toasterService.message =
                  "Impossible de se connecter au serveur";
                break;
              }
            }
          }
          this.toasterService.open();
          return err instanceof HttpErrorResponse ? err.error : of(err);
        })
      );
  }
}
