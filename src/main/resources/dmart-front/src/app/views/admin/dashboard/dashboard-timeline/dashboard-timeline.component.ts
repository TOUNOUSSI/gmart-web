import { Component, HostListener, Input, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Post } from 'src/app/models/post.model';
import { Profile } from 'src/app/models/profile.model';
import { PostService } from 'src/app/services/post/post.service';
import { NewPostModalComponent } from 'src/app/views/post';

const batchSize: number = 2;

@Component({
  selector: 'dmart-dashboard-timeline',
  templateUrl: './dashboard-timeline.component.html',
  styleUrls: ['./dashboard-timeline.component.scss']
})
export class DashboardTimelineComponent implements OnInit {
  @Input("profile")
  public loadedProfile: Profile = new Profile();

  @Input("profileImageAvatar")
  profileImageAvatar: SafeResourceUrl;

  fileToUpload: File

  // Counter used to handle pageable posts
  counter: number = 0;
  public textPost: Post = new Post();
  public posts = [{}];

  constructor(
    private postService: PostService,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {

    await this.postService.getAllRecentPosts().subscribe((response) => {
      console.log(response);
      this.posts = response;
      if (this.posts.length <= batchSize) {
        this.counter = this.posts.length;
      } else {
        this.counter = batchSize;
      }
    });

  }

  ngAfterViewInit() {

  }

  /**
 * To open Modal Post Dialog
 */
  openDialog(): void {
    console.log("The dialog was closed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.height = "475px";
    dialogConfig.data = { "loadedProfile": this.loadedProfile, "profileImageAvatar": this.profileImageAvatar }
    const dialogRef = this.dialog.open(NewPostModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (
        dialogRef.componentInstance.post.description !== undefined &&
        dialogRef.componentInstance.post.description !== ""
      ) {

        console.log(dialogRef.componentInstance.post);
        this.posts.unshift(dialogRef.componentInstance.post);
        console.log("The dialog AfterClosed was closed");
      }
    });
  }

  /**
   * To handle key up text posting (Non-modal Post)
   */
  submitTextPostKeyUpEvent() {
    console.log("key up performed : ");
    this.postService.save(this.textPost, this.fileToUpload).subscribe((savedPost) => {
      if (savedPost !== undefined) {
        console.log("Posted");
        this.posts.unshift(savedPost);
        this.textPost = new Post();
      }
    });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let cursorPosition =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (
      Math.round(cursorPosition) + 1 >= max &&
      this.counter < this.posts.length
    ) {
      this.getMorePosts();
    }
  }

  getMorePosts() {
    if (this.counter <= this.posts.length - batchSize) {
      this.counter += batchSize;
    } else if (this.counter <= this.posts.length) {
      this.counter += this.posts.length - this.counter;
    }
  }


}
