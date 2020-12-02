import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewColumnComponent } from './new-column.component';

describe('NewColumnComponent', () => {
  let component: NewColumnComponent;
  let fixture: ComponentFixture<NewColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
