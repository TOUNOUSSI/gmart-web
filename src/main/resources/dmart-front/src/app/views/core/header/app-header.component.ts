import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Inject,
  Renderer2,
  HostBinding,
  Output,
  EventEmitter,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ProfileService } from "src/app/services/profile/profile.service";

@Component({
  selector: "app-header, cui-header",
  templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() fixed: boolean;
  @Input() navbarBrand: any;
  @Input() navbarBrandFull: any;
  @Input() navbarBrandMinimized: any;
  @Input() navbarBrandText: any = { icon: "【Ｄ】", text: "【Ｄ】DMART" };
  @Input() navbarBrandHref: ""; // deprecated, use navbarBrandRouterLink instead
  @Input() navbarBrandRouterLink: any[] | string = "";

  @Input() sidebarToggler: string | boolean;
  @Input() mobileSidebarToggler: boolean;

  @Input() asideMenuToggler: string | boolean;
  @Input() mobileAsideMenuToggler: boolean;

  pseudoname: string;

  @Output()
  public toggleSideBarMinimizer: EventEmitter<any> = new EventEmitter();

  isSidebarMinimized: boolean = false;

  private readonly fixedClass = "header-fixed";

  @HostBinding("class.app-header") _header = true;
  @HostBinding("class.navbar") _navbar = true;

  navbarBrandImg: boolean;

  private readonly breakpoints = ["xl", "lg", "md", "sm", "xs"];
  sidebarTogglerClass = "d-none d-md-block";
  sidebarTogglerMobileClass = "d-lg-none";
  asideTogglerClass = "d-none d-md-block";
  asideTogglerMobileClass = "d-lg-none";

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isFixed(this.fixed);
    this.navbarBrandImg = Boolean(
      this.navbarBrand || this.navbarBrandFull || this.navbarBrandMinimized
    );
    this.navbarBrandRouterLink = this.navbarBrandRouterLink[0]
      ? this.navbarBrandRouterLink
      : this.navbarBrandHref;
    this.sidebarTogglerClass = this.setToggerBreakpointClass(
      <string>this.sidebarToggler
    );
    this.sidebarTogglerMobileClass = this.setToggerMobileBreakpointClass(
      <string>this.sidebarToggler
    );
    this.asideTogglerClass = this.setToggerBreakpointClass(
      <string>this.asideMenuToggler
    );
    this.asideTogglerMobileClass = this.setToggerMobileBreakpointClass(
      <string>this.asideMenuToggler
    );
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, this.fixedClass);
  }

  isFixed(fixed: boolean = this.fixed): void {
    if (fixed) {
      this.renderer.addClass(this.document.body, this.fixedClass);
    }
  }

  setToggerBreakpointClass(breakpoint = "md") {
    let togglerClass = "d-none d-md-block";
    if (this.breakpoints.includes(breakpoint)) {
      const breakpointIndex = this.breakpoints.indexOf(breakpoint);
      togglerClass = `d-none d-${breakpoint}-block`;
    }
    return togglerClass;
  }

  setToggerMobileBreakpointClass(breakpoint = "lg") {
    let togglerClass = "d-lg-none";
    if (this.breakpoints.includes(breakpoint)) {
      togglerClass = `d-${breakpoint}-none`;
    }
    return togglerClass;
  }

  public sendChange() {
    this.isSidebarMinimized = !this.isSidebarMinimized;
    this.toggleSideBarMinimizer.emit(!this.isSidebarMinimized);
  }
}
