import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class DmartUtilsService {
  constructor(private router: Router) {}

  public loadProfileWithRefreshParams(url: string) {
    // this.router.navigate(['/admin/profile/'+this.pseudoname],{queryParams :{refresh :}})
    this.router
      .navigate([url], {
        skipLocationChange: true,
      })
      .then(() => {
        this.router.navigate([url]);
      });
  }
}
