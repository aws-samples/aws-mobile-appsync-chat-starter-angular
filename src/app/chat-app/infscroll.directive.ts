import { Directive, AfterViewInit, ElementRef, Input, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { pairwise, filter, exhaustMap } from 'rxjs/operators';

@Directive({
  selector: '[appInfscroll]'
})
export class InfscrollDirective implements AfterViewInit {

  scrollEvent;
  @Input() appInfscroll;

  _completedFetching;
  @Input()
  set completedFetching(val) {
    this._completedFetching = val;
    if (val) { this.updateScrollTop(); }
  }
  subject = new Subject<any>();
  obs = this.subject.asObservable();
  lastScrollHeight;
  constructor(private el: ElementRef) { }

  @HostListener('scroll') onScrollEvent() {
    const target = this.el.nativeElement;
    this.subject.next({
      scrollHeight: target.scrollHeight,
      scrollTop: target.scrollTop,
      clientHeight: target.clientHeight
    });
}

  ngAfterViewInit() {
    this.scrollEvent = this.obs.pipe(
      pairwise(),
      filter(this.isScrollingUpPastThreshold.bind(this)));
    this.scrollEvent.exhaustMap(() => this.appInfscroll()).subscribe({});
  }

  updateScrollTop() {
    if (!this.lastScrollHeight) { return; }
    const target = this.el.nativeElement;
    console.log('updateScrollTop', target.scrollTop, target.scrollHeight, this.lastScrollHeight);
    target.scrollTop = (target.scrollHeight - this.lastScrollHeight);
  }

  isScrollingUpPastThreshold(ePair) {
    const before = ePair[0];
    const current = ePair[1];
    const threshold = current.clientHeight * .35;

    const position = current.scrollTop;
    const result = before.scrollTop > current.scrollTop && position < threshold;
    // console.log('st:', before.scrollTop,  'st:', current.scrollTop,  'ch:', current.clientHeight,
    // 'sh:', current.scrollHeight,  'pos:', `${position}`.substr(0, 4),  'th:',  `${threshold}`.substr(0, 4),  '>',  result);
    this.lastScrollHeight = result ? current.scrollHeight : null;
    return result;
  }
}
