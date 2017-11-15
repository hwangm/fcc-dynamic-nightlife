import { Component, OnChanges, Input } from '@angular/core';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnChanges {
  @Input() data: string;
  bars: Object;
  isAuthenticated: boolean;
  
  constructor(private auth: AuthService, private user: UserService) { }
  
  markedAsGoing(barId: string): void {
    this.user.isGoing(barId).then(response => console.log(response));
  }
  markAsGoing(barId: string): void {
    this.user.save(barId).then(response => console.log(response));
  }
  unmarkAsGoing(): void {
    this.user.clear().then(response => console.log(response));
  }
  
  ngOnChanges(): void {
    this.auth.isAuthenticated().then(response => this.isAuthenticated = response.isAuthenticated);
    this.bars = JSON.parse(this.data);
  }

}
