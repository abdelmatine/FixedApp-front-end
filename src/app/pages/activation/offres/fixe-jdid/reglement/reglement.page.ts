import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.page.html',
  styleUrls: ['./reglement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ReglementPage implements OnInit {
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


  id : number = 0;




  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router) { }



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['actId'];
      console.log(this.id);
    });
  }


  submit(){}
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
            });
            await loading.present();
            this.http.post(`${environment.baseApiUrl}/api/Reglement/addReg/${this.id}`, formData)
              .subscribe(
                response => {
                  
                  loading.dismiss();
                  this.router.navigate(['/home']);
                },
                error => {
                  alert('Une erreur s\'est produite lors de l\'enregistrement des données :');
                }
              );
          }
        }
      ]
    });

    // Afficher la boîte de dialogue de confirmation
    await confirmAlert.present();



  this.submit();
    const emailEndpoint = 'http://localhost:8080/api/email/send';
    const smsEndpoint = 'http://localhost:8080/api/ooredoo/SMS';

    const emailData = new FormData();
    emailData.append('to', 'abdelmatinesfar@gmail.com');
    emailData.append('cc', 'abdelmatinesfar@gmail.com');
    emailData.append('subject', 'ACTIVATION FORFAIT');
    emailData.append('body', 'Félicitation votre forfait a été activé avec succès');

    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (file) {
      emailData.append('file', file);
    }

    const smsData = {
      smsMessages: 'Félicitation votre forfait a été activé avec succès.',
      destinationSMSNumber: '+21656757140'
    };

    const emailRequest = this.http.post(emailEndpoint, emailData);
    const smsRequest = this.http.post(smsEndpoint, smsData);


    forkJoin([emailRequest, smsRequest]).subscribe(
      (responses) => {
        console.log('Requests completed successfully!');
        // Handle responses as needed
      },
      (error) => {
        console.error('Failed to send requests:', error);
      }
    );

}
retour(){this.router.navigate(['/fixe-jdid'])}

  }