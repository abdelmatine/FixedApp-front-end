import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ValidationPage } from '../prospection/validation/validation.page';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  items: any;
  selections: any;

  constructor(
    private router:Router,
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController
    ) { }
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
        route: 'reservations'
  
  
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



    this.selections=[
      {
  
        img: 'assets/images/offres/fixejdid.png',
        name: 'FIXE JDID',
        route: 'reservations'
  
      },
      {
  
        img: 'assets/images/offres/flashbox.png',
        name: 'FLASH BOX',
        route: ''
  
  
      },    {
  
        img: 'assets/images/offres/superbox.png',
        name: 'SUPER BOX',
        route: ''
  
  
      },    {
  
        img: 'assets/images/offres/fastplusbox.png',
        name: 'FAST+ BOX',
        route: ''
  
  
      },    {
  
        img: 'assets/images/offres/fastbox.png',
        name: 'FAST BOX',
        route: ''
  
  
      },
      {
  
        img: 'assets/images/offres/fibre.png',
        name: 'FIBRE OPTIQUE',
        route: ''
  
  
      },
    
    ]
  
  }

  goto(item: { route: string; }){

    if (item.route=='reservations'){
      this.setOpen(true);
    }
    else if(item.route!=='reservations'){
      this.router.navigate(['/'+item.route])

    }
  }

isModalOpen = false;
setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}


goToOffer(selection : {route: string;}) {
  /////////// bug here //////////////
  this.modalController.dismiss();
  this.isModalOpen = false;
  this.router.navigate(['/'+selection.route]);
}


async onLogout() {
  const loadingAlert = await this.presentLoading(); // Show loading spinner for logout

  this.authService.logout().subscribe(
    () => {
      loadingAlert.dismiss(); // Dismiss loading spinner
      this.navCtrl.navigateRoot('/login'); // Navigate to login page
    },
    error => {
      loadingAlert.dismiss(); // Dismiss loading spinner
      // Handle error if logout fails
      this.presentErrorAlert('Logout failed'); // Show error alert
    }
  );
}


async presentLoading() {
  const loading = await this.alertController.create({
    message: 'Déconnexion en cours...',
    translucent: true,
    backdropDismiss: false,
  });
  await loading.present();
  return loading;
}

async presentErrorAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: message,
    buttons: ['OK']
  });
  await alert.present();
}


}
