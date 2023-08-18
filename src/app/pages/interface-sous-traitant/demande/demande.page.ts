import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SousTraitantService } from '../sous-traitant-services/sous-traitant.service';
import { DetailDemandePage } from './detail-demande/detail-demande.page';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.page.html',
  styleUrls: ['./demande.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DemandePage implements OnInit {


  searchTerm: string | undefined;
  data: any = [];
  demandes: any = [];

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private stService: SousTraitantService
  ) { }

  ngOnInit() {
    this.getListDemande();
  }


  Search(){

  }

  getListDemande(){
    this.stService.getAllDemandeinter().subscribe(data => {
      console.log(data);
      this.demandes = data;
    })
  }

  loadMore($event: Event) {
    throw new Error('Method not implemented.');
    }

    async openDetails(itemDetails: any) {
      const modal = await this.modalCtrl.create({
        component: DetailDemandePage,
        componentProps: {
          itemDetails: itemDetails,
        },
      });
      await modal.present();
    }

}
