import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-st',
  templateUrl: './home-st.page.html',
  styleUrls: ['./home-st.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomeStPage implements OnInit {

  items: any;

  constructor(    
    private router:Router,
    ) { }

  ngOnInit() {

    this.items=[
      {
  
        img: 'assets/images/demande.png',
        name: 'Demandes interventions',
        route: 'demande'
  
      },
      {
  
        img: 'assets/images/reserv.png',
        name: 'planning interventions',
        route: 'planning'
  
  
      },    {
  
        img: 'assets/images/reg.png',
        name: 'Traitements & interventions',
        route: 'traitement'
  
  
      }
    
    ]

  }


  goto(item: { route: string; }){

      this.router.navigate(['/'+item.route])

  }


}
