import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private webReqService: WebRequestService) { }

  createColumn(title: string) {
    return this.webReqService.post('columns', { title });
  }
}
