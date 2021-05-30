import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWidgetComponent } from './post-widget.component';

describe('PostWidgetComponent', () => {
  let component: PostWidgetComponent;
  let fixture: ComponentFixture<PostWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
