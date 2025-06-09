import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css']
})
export class DetailsCardComponent {
  @Input() title: string = '';
  @Input() details: string[] = [];
}