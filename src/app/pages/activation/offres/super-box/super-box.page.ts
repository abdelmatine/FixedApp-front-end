import { Component, OnInit,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule,Validators} from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA ,ElementRef} from '@angular/core';
import SignaturePad from 'signature_pad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';




@Component({
  selector: 'app-super-box',
  templateUrl: './super-box.page.html',
  styleUrls: ['./super-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SuperBoxPage implements OnInit {
  prospector: FormGroup ;

  @ViewChild('signaturePad') signaturePad: any;
  private signaturePadOptions: Object = { // options de signature_pad
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 2,
    maxWidth: 4,
  };
  private canvas: any;
  private signaturePadInstance: any;
  signatureImage!: string;

  constructor(private http:HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder) {
      this.prospector = this.formBuilder.group({
        choix: ['', Validators.required],
        iccid: ['' ,Validators.required],
        adresse: ['', Validators.required],
        numeroserie:['', Validators.required],
        zonerecherche:['', Validators.required],
        msisdn:['', Validators.required],
        signature_image:['', Validators.required],
      });
    }
    public getSignatureImage(id: number) {
      const headers = new HttpHeaders().set('Accept', 'image/png');
      this.http.get(`http://localhost:8080/signature/${id}`, { headers, responseType: 'blob' })
        .subscribe(response => {
          this.displaySignatureImage(response);
        }, error => {
          console.error('Failed to fetch the signature image:', error);
        });
    }
    public displaySignatureImage(imageBlob: Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataURL = reader.result as string;
        this.signatureImage = imageDataURL;
      };
      reader.readAsDataURL(imageBlob);
    }

    submit() {
    }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.canvas = this.signaturePad.nativeElement;
    this.signaturePadInstance = new SignaturePad(this.canvas, this.signaturePadOptions);
  }

  public clear() {
    this.signaturePadInstance.clear();
  }

  public save() {
    const dataURL = this.signaturePadInstance.toDataURL();
    console.log(dataURL);
  }
  Valider(){
    const dataURL = this.signaturePadInstance.toDataURL();
    const signatureData = { signature: dataURL };
    this.http.post('http://localhost:8080/SuperBox/add', { signature: dataURL })
    .subscribe(response => {
      console.log('Signature saved successfully!');

    }, error => {
      console.error('Failed to save the signature:', error);
      // Gérez les erreurs si nécessaire
    });
  }



  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
  }

  ActiverBox(){
    const formData = this.prospector.value;
    const iccid = formData.iccid;

    this.http.post('http://localhost:8080/SuperBox/ajouter', formData)
    .subscribe(response => {
      // Traitement de la réponse du backend
      console.log('Données enregistrées avec succès !');
      // Ajoutez ici votre logique supplémentaire après l'enregistrement des données
    }, error => {
      console.error('Une erreur s\'est produite lors de l\'enregistrement des données :', error);
      // Gérez l'erreur selon vos besoins
    });


  }

}

