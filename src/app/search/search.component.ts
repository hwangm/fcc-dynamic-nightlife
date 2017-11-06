import { Component, OnInit, Input } from '@angular/core';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() title: string;
  location: string;
  
  constructor() { }
  
  submitLocation() {
    console.log(`location submitted: ${this.location}`);
  }

  ngOnInit() {
  }

}
