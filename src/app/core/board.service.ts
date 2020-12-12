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

  updateColumn(title: string, columnId: string) {
    return this.webReqService.put(`columns/${columnId}`, {title, columnId});
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

  updateTask(task: Task, newTitle: string) {
    return this.webReqService.put(`columns/${task._columnId}/tasks/${task._id}`, { title: newTitle });
  }

  moveTask(prevColumnId: string, columnId: string, taskId: string) {
    return this.webReqService.put(`columns/${prevColumnId}/tasks/${taskId}`, { _columnId: columnId });
  }

  deleteTask(task: Task) {
    return this.webReqService.delete(`columns/${task._columnId}/tasks/${task._id}`);
  }
}
