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

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private categoriasCollection: AngularFirestoreCollection<Categoria>;
  private categorias: Observable<Categoria[]>;

  private impactosCollection: AngularFirestoreCollection<Impacto>;
  private impactos: Observable<Impacto[]>;

  constructor(db: AngularFirestore) { 

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
   }

   getCategorias(){
     return this.categorias;
   }

   getImpactos(){
     return this.impactos;
   }
}
