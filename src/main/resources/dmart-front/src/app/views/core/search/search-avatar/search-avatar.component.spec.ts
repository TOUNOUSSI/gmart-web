import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAvatarComponent } from "./search-avatar.component";

describe("SearchAvatarComponent", () => {
  let component: SearchAvatarComponent;
  let fixture: ComponentFixture<SearchAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAvatarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
