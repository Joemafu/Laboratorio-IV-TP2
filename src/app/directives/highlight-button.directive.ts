import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightButton]',
  standalone: true
})
export class HighlightButtonDirective {

  @Input('appHighlightButton') highlightColor: string = '#114d79';
  private originalBackgroundColor: string | null = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.originalBackgroundColor = this.el.nativeElement.style.backgroundColor;
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.originalBackgroundColor);
  }

  private highlight(color: string | null) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }

}
