import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-val',
  templateUrl: './val.page.html',
  styleUrls: ['./val.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ValPage implements OnInit {

  latitude: number | undefined;
  longitude: number | undefined;
  place: 'CIN' | 'PASS' | 'SEJ' = 'CIN';

  constructor(
    private router:Router, 
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const state = window.history.state;
      this.latitude = state.lat;
      this.longitude = state.lng;
    });
    console.log(this.latitude, this.longitude);
  }


  Search(){
    const navigationExtras: NavigationExtras = {
      state: {
        lat: this.latitude,
        lng: this.longitude,
      },
      queryParams: {
        type: this.place,
      },
    };
    console.log(this.place);
    console.log(this.latitude, this.longitude);
    this.router.navigate(['/scan'], navigationExtras);

  }

}
