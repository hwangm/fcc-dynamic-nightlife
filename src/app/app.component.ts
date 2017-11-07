import { Component, OnChanges } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my app yo';
  isAuthenticated: boolean;
  name: string;
  
  constructor(private auth: AuthService){ }
  
  ngOnChanges(): void {
    this.auth.isAuthenticated().then(response => this.isAuthenticated = response.isAuthenticated);
    this.auth.getName().then(response => this.name = response.google.displayName);
  }
  
}
