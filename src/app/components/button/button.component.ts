import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() loading = false;
  @Input() disabled = false;
  @Input() color = 'primary';
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}
