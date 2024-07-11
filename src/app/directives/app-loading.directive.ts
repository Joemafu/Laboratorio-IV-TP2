import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAppLoading]',
  standalone: true
})
export class AppLoadingDirective {

  @Input() set appLoading(isLoading: boolean) {
    this.viewContainer.clear();
    if (isLoading) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  ngOnDestroy() {
    this.viewContainer.clear();
  }

}
