import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface Categoria {
  categoria: string;
}

export interface Impacto {
  abreviatura: string;
  impacto: string;
}
export interface Accion {
  accion: string;
}

export interface Empresa {
  // activo: boolean;
  // contacto: string;
  // descripcion: string;
  // direccion: string;
  // facebook: string;
  // funfact: string;
  // imagen: string;
  // logo: string;
  // mail: string;
  nombre: string;
  // rfc: string;
  // web: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private categoriasCollection: AngularFirestoreCollection<Categoria>;
  private categorias: Observable<Categoria[]>;

  private impactosCollection: AngularFirestoreCollection<Impacto>;
  private impactos: Observable<Impacto[]>;

  private accionesCollection: AngularFirestoreCollection<Accion>;
  private acciones: Observable<Accion[]>;

  private empresasCollection: AngularFirestoreCollection<Empresa>;
  private empresas: Observable<Empresa[]>;

  constructor(db: AngularFirestore) { 

    this.empresasCollection = db.collection<Empresa>('empresas');

    this.categoriasCollection = db.collection<Categoria>('categoria');
    this.categorias = this.categoriasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.impactosCollection = db.collection<Impacto>('impactos');
    this.impactos = this.impactosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );    

    // this.accionesCollection = db.collection<Impacto>('impactos').doc(id).collection<Accion>('acciones');
    // this.acciones = this.accionesCollection.snapshotChanges().pipe(
    //   map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   })
    // );
   }

   getCategorias(){
     return this.categorias;
   }

   getImpactos(){
     return this.impactos;
   }

   getAcciones(id){
    this.accionesCollection = this.impactosCollection.doc<Impacto>(id).collection<Accion>('acciones');
    this.acciones = this.accionesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
    return this.acciones;
   }

   addEmpresa(empresa: Empresa){
     return this.empresasCollection.add(empresa);
   }

   getEmpresas(){
     return 
   }
}
