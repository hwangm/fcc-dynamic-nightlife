import { Component } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { MatToolbarModule } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my app yo';
}
