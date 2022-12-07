import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
    @Input() control: FormControl<string | number | null> = new FormControl<string | null>('');
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() format: string = '';
}
