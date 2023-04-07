import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  items: any;
  constructor(private router:Router) { }
  ngOnInit() {

    this.items=[
      {
  
        img: 'assets/images/maps.png',
        name: 'Maps',
        route: 'maps'
  
      },
      {
  
        img: 'assets/images/prosp.png',
        name: 'prospection',
        route: 'prospection'
  
  
      },    {
  
        img: 'assets/images/on.png',
        name: 'Activation',
        route: 'activation'
  
  
      },    {
  
        img: 'assets/images/reserv.png',
        name: 'Reservation',
        route: 'reservation'
  
  
      },    {
  
        img: 'assets/images/sla.png',
        name: 'SLA',
        route: 'sla'
  
  
      },
      {
  
        img: 'assets/images/prof.png',
        name: 'Profile',
        route: 'profile'
  
  
      },
    
    ]
  
  }

  goto(item: { route: string; }){

    this.router.navigate(['/'+item.route])

  }



}
