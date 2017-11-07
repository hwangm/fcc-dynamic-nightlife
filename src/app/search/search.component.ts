import { Component, OnInit, Input } from '@angular/core';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() title: string;
  location: string;
  resultsFound = false;
  showError = false;
  yelpData: Object;
  error: any;
  
  constructor(private http: HttpClient) { }
  
  submitLocation() {
    const params = new HttpParams().set('address', this.location);
    this.http
        .get('/api/yelp', {params})
        .subscribe(data => {
          
          if(data['error'] == undefined) {
            this.resultsFound = true;
            this.yelpData = data;
          }
          else{
            this.error = data['error'];
            this.showError = true;
          }
        });

  }

  ngOnInit() {
  }

}
