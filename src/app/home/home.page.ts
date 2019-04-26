import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Categoria, Impacto, Accion, Empresa, Indicador, ConexionService } from '../services/conexion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  categorias: Categoria[];
  impactos: Impacto[];
  bp: Accion[];
  ds: Accion[];
  rn: Accion[];
  nuevaEmpresa : Empresa = {
    activo: false,
    contacto: "",
    descripcion: "",
    direccion: "",
    facebook: "",
    fbid: "",
    funfact: "",
    imagen: "",
    instagram: "",
    logo: "",
    mail: "",
    nombre: "",
    rfc: "",
    web: ""
  };
  fotoLogo : File;
  fotoImagen: File;

  indicador: Indicador[];
  ultimo: any;

  constructor(private conexionService: ConexionService, private alerta: AlertController){ }

  guardarEmpresa(){
    if(this.nuevaEmpresa.contacto && this.nuevaEmpresa.descripcion && this.nuevaEmpresa.direccion && this.nuevaEmpresa.facebook && this.nuevaEmpresa.funfact && this.fotoLogo && this.fotoImagen && this.nuevaEmpresa.mail && this.nuevaEmpresa.nombre && this.nuevaEmpresa.rfc && this.nuevaEmpresa.web){
      return this.conexionService.addEmpresa(this.nuevaEmpresa, this.ultimo, this.fotoLogo, this.fotoImagen, this.categorias, this.bp, this.ds, this.rn);
    }else{
      this.lanzarAlerta('FALSO');
    }
  }

  async lanzarAlerta(mensaje){
    const alertaMissing = await this.alerta.create({
      header: 'NO',
      message: mensaje,
      buttons: ['OK']
    });
    await alertaMissing.present();
  }

  prepararLogo(event: FileList){
    return this.fotoLogo = event[0];
  }

  prepararImagen(event: FileList){
    return this.fotoImagen = event[0];
  }

  ngOnInit(){

    this.conexionService.getCategorias().subscribe(res => {
      this.categorias = res;
    });

    this.conexionService.getImpactos().subscribe(res => {
      this.impactos = res;
    })

    this.conexionService.getAcciones('imp1').subscribe(res => {
      this.bp = res;
    })

    this.conexionService.getAcciones('imp2').subscribe(res => {
      this.ds = res;
    })

    this.conexionService.getAcciones('imp3').subscribe(res => {
      this.rn = res;
    })

    this.conexionService.getUltimaEmpresa().subscribe(res => {
      this.indicador = res;
      this.ultimo = this.indicador[0];
      this.ultimo = this.ultimo.ultimoEmpresa + 1;
    });

  }

}
