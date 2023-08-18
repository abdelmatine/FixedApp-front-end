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

  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit() {
  }
  onClickFIXEJDIDBOX(){
    this.router.navigateByUrl('/fixe-jdid')}
  onClickFLASHBOX(){    this.router.navigateByUrl('/flashbox')}

  onClickSUPERBOX(){
    this.router.navigateByUrl('/super-box');

  }
  onClickFBOX(){
    const params: NavigationExtras = {
      queryParams: {source: 'fastboxplus'}
    }
    this.router.navigate(['/fast-box'], params);

  }
  onClickFASTBOX(){
    const params: NavigationExtras = {
      queryParams: {source: 'fastbox'}
    }
    this.router.navigate(['/fast-box'], params);
  }

}