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

  getColumns() {
    return this.webReqService.get('columns');
  }

  createTask(title: string, columnId: string) {
    return this.webReqService.post(`columns/${columnId}/tasks`, { title });
  }

  getTasks(columnId: string) {
    return this.webReqService.get(`columns/${columnId}/tasks`);
  }
}
