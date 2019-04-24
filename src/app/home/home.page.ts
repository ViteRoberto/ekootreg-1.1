import { Component, OnInit } from '@angular/core';
import { Categoria, Impacto, Accion, Empresa, ConexionService } from '../services/conexion.service';

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
    funfact: "",
    imagen: "",
    logo: "",
    mail: "",
    nombre: "",
    rfc: "",
    web: ""
  };

  constructor(private conexionService: ConexionService){ }

  guardarEmpresa(){
    return this.conexionService.addEmpresa(this.nuevaEmpresa).then(() => {
      console.log("exito");
    })
  }

  ngOnInit(){

    this.conexionService.getCategorias().subscribe(res => {
      this.categorias = res;
      console.log(this.categorias);
    });

    this.conexionService.getImpactos().subscribe(res => {
      this.impactos = res;
      console.log(this.impactos);
    })

    this.conexionService.getAcciones('imp01').subscribe(res => {
      this.bp = res;
    })

    this.conexionService.getAcciones('imp02').subscribe(res => {
      this.ds = res;
    })

    this.conexionService.getAcciones('imp03').subscribe(res => {
      this.rn = res;
    })
  }

}
