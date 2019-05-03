import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef, AngularFireStorageReference } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { inspectNativeElement } from '@angular/platform-browser/src/dom/debug/ng_probe';
import { AlertController, LoadingController } from '@ionic/angular';


export interface Categoria {
  categoria: string;
  checked: boolean;
  id: string;
}

export interface Impacto {
  abreviatura: string;
  impacto: string;
}
export interface Accion {
  accion: string;
  checked: boolean;
  id: string;
}

export interface Empresa {
  activo: boolean;
  contacto: string;
  descripcion: string;
  direccion: string;
  facebook: string;
  funfact: string;
  factrn: string;
  factds: string;
  factbp: string;
  fbid: string;
  imagen: string;
  instagram: string;
  logo: string;
  mail: string;
  mision: string;
  nombre: string;
  razon: string;
  rfc: string;
  vision: string;
  web: string;
}

export interface Indicador {
  ultimoEmpresa: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private categoriasCollection: AngularFirestoreCollection<Categoria>;
  private categorias: Observable<Categoria[]>;

  // private catsCollection: AngularFirestoreCollection<Categoria>;

  private impactosCollection: AngularFirestoreCollection<Impacto>;
  private impactos: Observable<Impacto[]>;

  private accionesCollection: AngularFirestoreCollection<Accion>;
  private acciones: Observable<Accion[]>;

  private empresasCollection: AngularFirestoreCollection<Empresa>;
  private empresas: Observable<Empresa[]>;

  private indicadoresCollection: AngularFirestoreCollection<Indicador>;
  private indicadores: Observable<Indicador[]>;

  id: string;
//

//Main Task
  taskLogo: AngularFireUploadTask;
  taskImagen: AngularFireUploadTask;

  refx: AngularFireStorageReference;
  refy: AngularFireStorageReference;

//Progess Monitoring
  percentage: Observable<number>;
  snapshotLogo: Observable<any>;
  snapshoyImagen: Observable<any>;
  
  //Download URL
  downloadURLLogo: Observable<string>;
  downloadURLImagen: Observable<string>;
  urly: Observable<string>;
  contador: number = 0;

//
  constructor(private db: AngularFirestore, private st: AngularFireStorage, private alerta: AlertController, private cargar: LoadingController) { 

    this.empresasCollection = db.collection<Empresa>('empresas');

    this.indicadoresCollection = db.collection<Indicador>('indicadores');
    this.indicadores = this.indicadoresCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.categoriasCollection = db.collection<Categoria>('categorias');
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

   getUltimaEmpresa(){
     return this.indicadores;
   }

   async cargando(){
     const cargado = await this.cargar.create({
      message: 'Cargando...'
     });

     await cargado.present();
   }

   async quitar(){
     return await this.cargar.dismiss();
   }

   addEmpresa(empresa: Empresa, ultimo, fotoLogo: File, fotoImagen: File, categorias: Categoria[], bp: Accion[], ds: Accion[], rn: Accion[]){

    //CORRER LOADING
    this.cargando();

     //CREANDO ID PARA NUEVA EMPRESA
    this.id = "e";
    this.id = this.id.concat(ultimo);

    //ACTUALIZANDO ULTIMO ID DE EMPRESA
    this.indicadoresCollection.doc<Indicador>('ultimos').update({ultimoEmpresa: ultimo});

    //OBTENIENDO TIPO DE IMAGENES
    var tipoLogo = '';
    var tipoImagen = '';

    if(fotoLogo.type == 'image/jpeg'){
      tipoLogo = '.jpg';
    }else if(fotoLogo.type == 'image/png'){
      tipoLogo = '.png';
    }

    if(fotoImagen.type == 'image/jpeg'){
      tipoImagen = '.jpg';
    }else if(fotoImagen.type == 'image/png'){
      tipoImagen = '.png';
    }

    //CREANDO PATH PARA IMAGEN Y LOGO
    const pathLogo = this.id.concat('-logo',tipoLogo);
    const pathImagen = this.id.concat('-imagen',tipoImagen);

    //SUBIENDO LOGO E IMAGEN
    this.taskLogo = this.st.upload(pathLogo,fotoLogo);
    this.taskImagen = this.st.upload(pathImagen,fotoImagen);    

    //CREANDO REFERENCIA PARA OBTENER URL DOWNLOAD LOGO
    this.refx = this.st.ref(pathLogo);
    this.taskLogo.snapshotChanges().pipe(
      finalize(() => this.refx.getDownloadURL().subscribe(
        download => {
          this.downloadURLLogo = download;
          this.updateEmpresaLogo(this.id,download);
          this.contador = this.contador + 1;
          if(this.contador == 2){
            this.quitar();
            this.lanzarAlerta();
            this.contador = 0;
          }
        }
      ))
    ).subscribe();

    //CREANDO REFERENCIA PARA OBTENER URL DOWNLOAD IMAGEN
    this.refy = this.st.ref(pathImagen);
    this.taskImagen.snapshotChanges().pipe(
      finalize(() => this.refx.getDownloadURL().subscribe(
        download => {
          this.downloadURLImagen = download;
          this.updateEmpresaImagen(this.id,download);
          this.contador = this.contador + 1;
          if(this.contador == 2){
            this.quitar();
            this.lanzarAlerta();
            this.contador = 0;
          }
        }
      ))
    ).subscribe();

    //CREANDO EL DOCUMENTO DE LA EMPRESA
    this.empresasCollection.doc(this.id).set(empresa);

    //CREANDO LA COLECCIÓN DE CATEGORIAS
    this.categoriasCollection = this.empresasCollection.doc(this.id).collection('categorias');
    //AGREGANDO LAS CATEGORIAS SELECCIONADAS A LA COLECCIÓN
    categorias.forEach((key, value) => {
      if(key.checked){
        this.categoriasCollection.doc(key.id).set({categoria: key.categoria});
      }
    })

    //CREANDO COLECCIÓN DE IMPACTOS
    this.impactosCollection = this.empresasCollection.doc(this.id).collection('impactos');

    //CREANDO LA COLECCIÓN DE ACCIONES DE BIENESTAR PERSONAL
    this.impactosCollection.doc('imp1').set({abreviatura: 'bp', impacto: 'Bienestar Personal'})
    this.accionesCollection = this.empresasCollection.doc(this.id).collection('impactos').doc('imp1').collection('acciones');
    //AGREGANDO LOS IMPACTOS SELECCIONADOS A LA COLECCIÓN
    bp.forEach((key, value) => {
      if(key.checked){
        this.accionesCollection.doc(key.id).set({accion: key.accion});
      }
    })

    //CREANDO LA COLECCIÓN DE ACCIONES DE DESARROLLO SOCIAL
    this.impactosCollection.doc('imp2').set({abreviatura: 'ds', impacto: 'Desarrollo Social'})
    this.accionesCollection = this.empresasCollection.doc(this.id).collection('impactos').doc('imp2').collection('acciones');
    //AGREGANDO LOS IMPACTOS SELECCIONADOS A LA COLECCIÓN
    ds.forEach((key,value) => {
      if(key.checked){
        this.accionesCollection.doc(key.id).set({accion: key.accion});
      }
    })

    //CREANDO LA COLECCIÓN DE ACCIONES DE RESPETO A LA NATURALEZA
    this.impactosCollection.doc('imp3').set({abreviatura: 'rn', impacto: 'Respeto a la Naturaleza'})
    this.accionesCollection = this.empresasCollection.doc(this.id).collection('impactos').doc('imp3').collection('acciones');
    //AGREGANDO LOS IMPACTOS SELECCIONADOS A LA COLECCIÓN
    rn.forEach((key,value) => {
      if(key.checked){
        this.accionesCollection.doc(key.id).set({accion: key.accion});
      }
    })

   }

   updateEmpresaLogo(id,logo){
    this.empresasCollection.doc(id).update({logo: logo});
   }

   updateEmpresaImagen(id,imagen){
     this.empresasCollection.doc(id).update({imagen: imagen});
   }

   async lanzarAlerta(){
     const alertaExito = await this.alerta.create({
       header: '¡LISTO!',
       message: 'Hemos recibido tus datos, te mandaremos un correo cuando hayamos verificado toda tu información. ¡Saludos!',
       buttons: [{
         text: 'OK',
         handler: () => {
           window.open('https://www.ekoot.mx','_self');
         }
       }]
     });
     await alertaExito.present();
   }
  //  getEmpresas(){
  //  }
}
