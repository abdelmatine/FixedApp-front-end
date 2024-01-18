import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  ActivatedRoute, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-offres',
  templateUrl: './offres.page.html',
  styleUrls: ['./offres.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OffresPage implements OnInit {

  selections: any;
  id : number = 0;
  constructor(
    private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.id = params['actId'];
      console.log(this.id);
    });

    this.selections=[
      {
  
        img: 'assets/images/offres/fixejdid.png',
        name: 'FIXE JDID',
        route: '/fixe-jdid'
  
      },
      {
  
        img: 'assets/images/offres/flashbox.png',
        name: 'FLASH BOX',
        route: '/flashbox'
  
  
      },    {
  
        img: 'assets/images/offres/superbox.png',
        name: 'SUPER BOX',
        route: '/super-box'
  
  
      },    {
  
        img: 'assets/images/offres/fastplusbox.png',
        name: 'FAST+ BOX',
        route: '/fastboxplus'
  
  
      },    {
  
        img: 'assets/images/offres/fastbox.png',
        name: 'FAST BOX',
        route: '/fastbox'
  
  
      },
      {
  
        img: 'assets/images/offres/fibre.png',
        name: 'FIBRE OPTIQUE',
        route: ''
  
  
      },
    
    ]
  }

goToOffer(selection : {route: string;}) {
  const navigationExtras: NavigationExtras = {
    queryParams: {
      actId: this.id
    }
  };
  this.router.navigate(['/'+selection.route], navigationExtras);
}


}