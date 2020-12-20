import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
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

  renameColumn(title: string, columnId: string) {
    return this.webReqService.put(`columns/${columnId}`, {title, columnId});
  }

  moveColumn(columnId: string, prevColumnIndex: number, newColumnIndex: number) {
    return this.webReqService.put(`columns/${columnId}/moveColumn`, { prevColumnIndex, newColumnIndex });
  }

  deleteColumn(columnId: string) {
    return this.webReqService.delete(`columns/${columnId}`);
  }

  createTask(title: string, columnId: string) {
    return this.webReqService.post(`columns/${columnId}/tasks`, { title });
  }

  getTasks(columnId: string) {
    return this.webReqService.get(`columns/${columnId}/tasks`);
  }

  completeTask(task: Task) {
    return this.webReqService.put(`columns/${task._columnId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

  renameTask(task: Task, newTitle: string) {
    return this.webReqService.put(`columns/${task._columnId}/tasks/${task._id}`, { title: newTitle });
  }

  moveTask(prevColumnId: string, newColumnId: string, prevColumnIndex: number, newColumnIndex: number, taskId: string) {
    return this.webReqService.put(`columns/${prevColumnId}/tasks/${taskId}/moveTask`,
      { newColumnId, prevColumnIndex, newColumnIndex });
  }

  deleteTask(task: Task) {
    return this.webReqService.delete(`columns/${task._columnId}/tasks/${task._id}`);
  }
}
