import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-raccordement',
  templateUrl: './raccordement.page.html',
  styleUrls: ['./raccordement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class RaccordementPage implements OnInit {

  constructor(private router: Router ) { }


  ngOnInit() {
  }
  Valider(){this.router.navigateByUrl('/rac-fast-box');
}
  Retour(){this.router.navigateByUrl('/fast-box')}
}