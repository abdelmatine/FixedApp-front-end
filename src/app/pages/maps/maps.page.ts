import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as Leaflet from 'leaflet';
import { Router } from '@angular/router';
import { control } from 'leaflet';
import 'leaflet-control-geocoder';
import GeocoderControl from 'leaflet-control-geocoder';



@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapsPage implements OnInit {
  map! : Leaflet.Map;
  properties: any[] = [
  ];
  query!: string;
  private circle!: Leaflet.Circle;
  coordonees:any=[];
  caseStatus!:any;
  private serviceUrl='http://localhost:8080';

  constructor(private http:HttpClient,private router: Router) {

  }




  ngOnInit() {

  }

  runHttp(){
    this.http.get('http://localhost:8080/maps/list')

    .subscribe(data => {

      console.log();
      this.coordonees = data;

    });

}


  ionViewDidEnter(){
  var map=Leaflet.map('map').setView([36.806,10.1815],10);
  Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{

}).addTo(map);
//position actuelle
const currentPositionIcon = Leaflet.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

navigator.geolocation.getCurrentPosition(function (position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const latlng = Leaflet.latLng([latitude, longitude]);
  const marker = Leaflet.marker(latlng, { icon: currentPositionIcon }).addTo(map);
  map.setView(latlng, 13);
});
//search address
const searchControl = new GeocoderControl({
  placeholder: 'Enter address...',
  defaultMarkGeocode: true,
  collapsed: true
}).addTo(map);
searchControl.on('markgeocode', function (e) {
  map.flyTo(e.geocode.center, 13);
  Leaflet.marker(e.geocode.center, {
  }).addTo(map);
});



//custom marker
//var iconoptions={
  //iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  //iconSize: [25, 41] as Leaflet.PointTuple,
//}
//var customIcon=Leaflet.icon(iconoptions);
//var markerOptions={
  //icon:customIcon,
  //draggable:true,
//}
//map.on("click",function(e){
  //var mc  =new Leaflet.Marker([e.latlng.lat,e.latlng.lng],markerOptions).addTo(map);
///}
//);

//Ajouter une Cercle et les bouttons .
const circle = Leaflet.circle([36.806,10.1815], { radius: 3000,color:'yellow',fillOpacity:0.5,fillColor:'yellow' }).addTo(map);
circle.setStyle({ fillColor: 'yellow' });

let ficheControlAdded = false;
let reservationControlAdded = false;
let activationSuperBoxControlAdded = false;
let activationFastBoxControlAdded = false;

circle.on('click', (e) => {
  if (!ficheControlAdded) {
    const control = new ficheControl();
    control.addTo(map);
    ficheControlAdded = true;
  }
  if (!reservationControlAdded) {
    const control = new reservationControl();
    control.addTo(map);
    reservationControlAdded = true;
  }
  if (!activationSuperBoxControlAdded) {
    const control = new activationSuperBoxControl();
    control.addTo(map);
    activationSuperBoxControlAdded = true;
  }

  if (!activationFastBoxControlAdded) {
    const control = new activationFastBoxControl();
    control.addTo(map);
    activationFastBoxControlAdded = true;
  }
});

const ficheControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-fiche");
    button.textContent = "Fiche de prospection";
    button.onclick = function () {
      window.location.href = "/prospection";
      //alert("Ouvrir la fiche de prospection ici");
    };
    return button;
  }
});
const reservationControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-reservation");
    button.textContent = "Réservation FWBA";
    button.onclick = function () {
      alert("Ouvrir la réservation FWBA ici");
    };
    return button;
  }
});
const activationSuperBoxControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-activation-super-box");
    button.textContent = "Activation Super Box";
    button.onclick = function () {
      alert("Activer la Super Box ici");
    };
    return button;
  }
});
const activationFastBoxControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-activation-fast-box");
    button.textContent = "Activation Fast Box";
    button.onclick = function () {
      alert("Activer la Fast Box ici");
    };
    return button;
  }
});

}
}
