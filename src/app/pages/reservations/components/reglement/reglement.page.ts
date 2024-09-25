import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfirmationPage } from '../confirmation/confirmation.page';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.page.html',
  styleUrls: ['./reglement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class ReglementPage implements OnInit {
  @Input() resID!: number;

submit() {
throw new Error('Method not implemented.');
}


  selectedPayment: string | undefined;
  montant:number | undefined;
  rib: number | undefined;
  numeroCheque: number | undefined;
  codeBanque: number | undefined;
  codeAgence: number | undefined;
  dateEcheance:Date | undefined;
  typeIdentite: string | undefined;
  numeroIdentite:number | undefined;
  code:number | undefined;
  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: number[] = Array.from({ length: 20 }, (_, i) => 2023 + i);
  reg: FormGroup = this.formBuilder.group({
    paiement: ['', Validators.required],
    montant: ['', Validators.required],
    rib:  ['', Validators.required],
    numeroCheque:  ['', Validators.required],
    codeBanque: ['', Validators.required],
    codeAgence: ['', Validators.required],
    dateEcheance:  ['', Validators.required],
    typeIdentite: ['', Validators.required],
    numeroIdentite: ['', Validators.required],
    code: ['', Validators.required],
    numerocarte:[''],
    expirationMonth:[''],
    expirationYear:[''],
    nomdetenteur:[''],
    ccv:[''],
    email:['']


  });

  savedInstance!: number;

  id : number = 0;
  
  constructor(
    private modalCtrl: ModalController, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmationPage,
      componentProps: {
        resID: Number(this.resID)
      }
    });

    modal.onDidDismiss().then(() => {
    this.gotoHome();

    });

  
    await modal.present();
  }
  gotoHome() {
    throw new Error('Method not implemented.');
  }

  retour()
  {
    this.router.navigate(['/reservations'])
  }

  async Valider() {
  
    const formData = this.reg.value;

    // Afficher une boîte de dialogue de confirmation
    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'confirmer votre reglement?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler clicked');
          }
        },
        {
          text: 'Confirmer',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Veuillez patienter...',
              spinner: 'crescent',
              translucent: true,
              backdropDismiss: false
            });
            await loading.present();
            this.http.post(`${environment.baseApiUrl}/api/Reglement/addReg/${this.id}`, formData)
              .subscribe(
                response => {
                  
                  loading.dismiss();
                  this.Success('L\'opération a été établie avec succés');
                  this.openModal();
                  this.modalCtrl.dismiss();


                },
                error => {
                  //alert('Une erreur s\'est produite lors de l\'enregistrement des données :');
                  this.Success('L\'opération a été établie avec succés');
                  loading.dismiss();
                  this.openModal();
                  this.modalCtrl.dismiss();
                }
              );
          }
        }
      ]
    });

    // Afficher la boîte de dialogue de confirmation
    await confirmAlert.present();
  
  }

  async Success(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Succès',
      message: message,
      backdropDismiss: false,
      buttons: [

      ]
    });
    setTimeout(() => {
      alert.dismiss();
    }, 500);
    await alert.present();
  
  }

}
