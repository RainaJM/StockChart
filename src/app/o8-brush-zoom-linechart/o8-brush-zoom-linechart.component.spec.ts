import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { O8BrushZoomLinechartComponent } from './o8-brush-zoom-linechart.component';

describe('O8BrushZoomLinechartComponent', () => {
  let component: O8BrushZoomLinechartComponent;
  let fixture: ComponentFixture<O8BrushZoomLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ O8BrushZoomLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(O8BrushZoomLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
