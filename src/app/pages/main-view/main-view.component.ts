import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { BoardService } from '../../core/board.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  @ViewChild('taskTitleInput') taskTitleInput: ElementRef;

  columns: Column[];

  selectedColumnTitle: string;
  openTask: boolean;
  selectedTask: Task;
  selectedTaskTitle: string;

  constructor(private boardService: BoardService, private authService: AuthService) { }

  ngOnInit(): void {
    this.boardService.getColumns().subscribe((columns: Column[]) => {
      this.columns = columns; 

      // Getting the tasks inside of each column from the server and assigning the tasks to the column for the frontend
      this.columns.forEach((column) => {
        this.boardService.getTasks(column._id).subscribe((tasks: Task[]) => {
          column.tasks = tasks;
          column.isTitleSelected = false;
        });
      });
    });

    this.openTask = false;
  }

  getOtherColumns(singleColumnId: string) {
    this.columns.filter(column => column._id !== singleColumnId);
  }

  renameColumn(columnId: string) {
    this.columns.forEach((column) => {
      if (column._id === columnId) {
        this.selectedColumnTitle = column.title;
        column.isTitleSelected = true;
        return false;
      }
    });
  }

  updateColumn(columnId: string, newTitle: string) {
    // Update the column title if the new title is not the same as the old title
    if (this.selectedColumnTitle !== newTitle) {
      this.boardService.updateColumn(newTitle, columnId).subscribe(res => {
        console.log(res);
      });
    }

    this.columns.forEach((column) => {
      if (column._id === columnId) {
        column.title = newTitle;
        column.isTitleSelected = false;
        return false;
      }
    });
  }

  deleteColumn(columnId: string) {
    this.boardService.deleteColumn(columnId).subscribe(res  => {
      console.log(res);
    });

    this.columns = this.columns.filter(column => column._id !== columnId);
  }

  completeTask() {
    this.boardService.completeTask(this.selectedTask).subscribe(() => {
      this.selectedTask.completed = !this.selectedTask.completed;
    });
  }

  updateTask(newTitle: string) {
    if (newTitle) {
      // Update the column title if the new title is not the same as the old title
      if (this.selectedTaskTitle !== newTitle) {
        this.boardService.updateTask(this.selectedTask, newTitle).subscribe(res => {
          console.log(res);
        });

        this.columns.forEach((column) => {
          if (column._id === this.selectedTask._columnId) {
            column.tasks.forEach(task => {
              if (task._id === this.selectedTask._id) {
                task.title = newTitle;
                return false;
              }
            });
          }
        });
      }

      this.openTask = false;
    }
  }

  moveTask(prevColumnId: string, newColumnId: string, taskId: string) {
    if (prevColumnId && newColumnId && taskId) {
      this.boardService.moveTask(prevColumnId, newColumnId, taskId).subscribe(res => {
        console.log(res);
      });
    }
  }

  deleteTask() {
    this.boardService.deleteTask(this.selectedTask).subscribe(res  => {
      console.log(res);
    });

    this.columns.forEach((column) => {
      if (column._id === this.selectedTask._columnId) {
        column.tasks = column.tasks.filter(task => task._id !== this.selectedTask._id);
        return false;
      }
    });

    this.openTask = false;
  }

  openTaskModal(task: Task) {
    this.selectedTask = task;
    this.selectedTaskTitle = task.title;
    this.openTask = true;
  }

  closeTaskModal() {
    this.openTask = false;

    // Resetting the value of the input form
    this.taskTitleInput.nativeElement.value = this.selectedTaskTitle;
  }

  logout() {
    this.authService.logout();
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.tasks, event.previousIndex, event.currentIndex);
    }
    else {
      transferArrayItem(event.previousContainer.data.tasks,
                        event.container.data.tasks,
                        event.previousIndex,
                        event.currentIndex);

      this.moveTask(event.previousContainer.data.columnId, event.container.data.columnId, event.container.data.tasks[event.currentIndex]._id);
    }
  }
}
