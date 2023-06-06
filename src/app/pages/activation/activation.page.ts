import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.page.html',
  styleUrls: ['./activation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ActivationPage implements OnInit {
  place: 'CIN' | 'PASSEPORT' | 'SEJ' = 'CIN';


  constructor(private router:Router) { }

  ngOnInit() {
  }
  valider(){
    console.log(this.place)
    const params: NavigationExtras = {
      queryParams: {type: this.place}
    }
    this.router.navigate(['/activer'], params);
  }
  }

