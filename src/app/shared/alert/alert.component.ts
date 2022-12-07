import {Component, Input} from '@angular/core';

export type AlertColor = 'blue' | 'green' | 'red';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
    @Input() color: AlertColor = 'blue';

    get backgroundColor() {
        return `bg-${this.color}-400`;
    }
}
