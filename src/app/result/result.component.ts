import { Component, OnChanges, Input } from '@angular/core';
import { MatCardModule } from '@angular/material';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnChanges {
  @Input() data: string;
  bars: Object;
  
  constructor() { }

  ngOnChanges() {
    this.bars = JSON.parse(this.data);
  }

}
