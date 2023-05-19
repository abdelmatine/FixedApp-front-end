import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProspectionService } from './formulaire/services/prospection.service';
import { DetailprospPage } from './detailprosp/detailprosp.page';
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
    
  searchProsp() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.getListProspection();
      return;
    }
  
    const url = `http://localhost:8080/SpringMVC/Prospection/search?attribute=${this.selectedAttribute}&query=${this.searchTerm}`;

    this.http.get(url).subscribe((data) => {
   
        this.prospections = data;
        this.notFoundMessage = '';
      
    });
  }

  filterItems() {
    return this.prospections.filter((item: { name: string; }) => {
      return item.name.toLowerCase().indexOf(this.searchTerm!.toLowerCase()) > -1;
    });
  }


  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }


  Search(){
    console.log(this.place)
    const params: NavigationExtras = {
      queryParams: {type: this.place}
    }
    this.router.navigate(['/validation'], params);
  }


  getListProspection(){
    this.http.get('http://localhost:8080/SpringMVC/Prospection/getallprospections')
    .subscribe(data => {
      console.log(data);
      this.prospections = data;
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getListProspection();
      event.target.complete();
    }, 2000);
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

