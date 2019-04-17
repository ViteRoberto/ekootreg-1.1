import { Component, OnInit } from '@angular/core';
import { Categoria, Impacto, ConexionService } from '../services/conexion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  categorias: Categoria[];
  impactos: Impacto[];

  constructor(private conexionService: ConexionService){  }

  ngOnInit(){
    this.conexionService.getCategorias().subscribe(res => {
      this.categorias = res;
      console.log(this.categorias);
    });

    this.conexionService.getImpactos().subscribe(res => {
      this.impactos = res;
      console.log(this.impactos);
    })
  }

}
