import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailprospPage } from './detailprosp/detailprosp.page';
import { ProspectionService } from './services/prospection.service';

@Component({
  selector: 'app-prospection',
  templateUrl: './prospection.page.html',
  styleUrls: ['./prospection.page.scss'],
  standalone: true,
  providers: [ProspectionService],

  imports: [IonicModule, CommonModule, FormsModule,HttpClientModule]
})
export class ProspectionPage implements OnInit {


  @ViewChild(IonModal) modal: IonModal | undefined;


  badgeColor: any;
  searchTerm: string | undefined;
  selectedAttribute: string | undefined;
  notFoundMessage: string | undefined;

  //searchResults: any[] | undefined;
 

  place: 'CIN' | 'PASS' | 'SEJ' = 'CIN';

  constructor(

        private prospectionService: ProspectionService,
        private http: HttpClient, 
        private router:Router, 
        private modalCtrl: ModalController)
        
        
        { 
          this.getListProspection();
        }


  prospections:any = [];

  ngOnInit() {
    this.selectedAttribute = 'fullName';
 
  }

  
  async openDetails(itemDetails: any) {
    const modal = await this.modalCtrl.create({
      component: DetailprospPage,
      componentProps: {
        itemDetails: itemDetails,
      },
    });
    await modal.present();
  }


  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }


  handleRefresh(event: any) {
    setTimeout(() => {
      this.getListProspection();
      event.target.complete();
    }, 2000);
  }

  Search(){
    console.log(this.place)
    const params: NavigationExtras = {
      queryParams: {type: this.place}
    }
    this.router.navigate(['/validation'], params);
  }
    
  searchProsp() { 
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.getListProspection();
      return;
    }

    this.prospectionService.searchProspection(this.selectedAttribute!, this.searchTerm)
      .subscribe((data) => {
        this.prospections = data;
        this.notFoundMessage = '';
      });
  }


  getListProspection(){
    this.prospectionService.getAllProspection().subscribe(data => {
      console.log(data);
      this.prospections = data;
    })
  }

}


  /*



    async presentToast() {
    const toast = await this.toastController.create({
      message: 'Data added succesfully',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }


    filterItems() {
    return this.prospections.filter((item: { name: string; }) => {
      return item.name.toLowerCase().indexOf(this.searchTerm!.toLowerCase()) > -1;
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [      
        {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'OK',
        handler: () => {
          console.log('OK clicked');
        }
      }]
    });
    await alert.present();
  }
  
  
  
  
  async deleteConfirmation(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette prospection ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Action annulée');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            console.log('Action de suppression');
            this.onDeleteProspections(id);
          }
        }
      ]
    });
    await alert.present();
  }
  
  async onDeleteProspections(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Veuillez patienter...',
    });
    await loading.present();
    this.prospectionService.deleteProspection(id).subscribe(
      (response) => {
        loading.dismiss();
        this.getListProspection();
        this.presentAlert('Success', 'La prospection N°:' + id + ' a été supprimée');
        console.log('Prospection deleted successfully');
      },
      (error) => {
        loading.dismiss();
        this.presentAlert('Error', 'Suppression échouée. Merci de réessayer.');
        console.error('Error deleting prospection:', error);
      }
    );
  }
}*/

