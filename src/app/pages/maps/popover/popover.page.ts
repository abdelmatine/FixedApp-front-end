import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, PopoverController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PopoverPage {

  private pageMapping: { [buttonName: number]: string } = {
    1: '/prospection',
    2: '/reservations',
    3: '/fast-box',
    4: '/super-box'
  };

  
  latitude: number;
  longitude: number;

  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private navParams: NavParams) { 
      const state = this.navParams.get('state');
      this.latitude = state.lat;
      this.longitude = state.lng;
    }


    buttonClicked(buttonName: number) {
      const pagePath = this.pageMapping[buttonName];
      if (pagePath) {
        this.navigateToPage(pagePath);
      }
      this.popoverController.dismiss();
    }
  
    navigateToPage(pagePath: string) {

    const navigationExtras: NavigationExtras = {
      state: {
        lat: this.latitude,
        lng: this.longitude
      }
    };
    this.router.navigate([pagePath], navigationExtras);    
  }

}
