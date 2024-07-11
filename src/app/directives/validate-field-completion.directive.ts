import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appValidateFieldCompletion]',
  standalone: true
})
export class ValidateFieldCompletionDirective implements OnChanges {

  @Input() appValidateFieldCompletion?: FormGroup;
  @Input() currentFieldName?: string;
  @Input() nextFieldName?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.appValidateFieldCompletion) {
      const currentField = this.appValidateFieldCompletion.get(this.currentFieldName!);
      const nextField = this.appValidateFieldCompletion.get(this.nextFieldName!);

      if (currentField && nextField) {
        if (currentField.value && !nextField.value) {
          nextField.enable();
        } else {
          nextField.disable();
        }
      }
    }
  }
}
