import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class UploadFileService {

  constructor() { }

  uploadFile(file:File, type:string, id:string){
   
    return new Promise((resolve,reject)=>{
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('image',file,file.name);
      xhr.onreadystatechange = ()=>{
        if(xhr.readyState === 4){
          if(xhr.status === 200){
             resolve(JSON.parse(xhr.response))
          }else{
            reject(xhr.response);
          }
        }
      };
      let url = `${environment.backend}/upload/${type}/${id}`;
      xhr.open('PUT',url, true);
      xhr.send(formData);
    });
  }

}
