import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prospection',
  templateUrl: './prospection.page.html',
  styleUrls: ['./prospection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProspectionPage implements OnInit {

  place: any;

  constructor(private router:Router) { }

  ngOnInit() {

 
  }

  Search(){
    console.log(this.place)
    this.router.navigate(['/prospection/validation'])

  }


}
