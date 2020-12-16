import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { BoardService } from '../../core/board.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  @ViewChild('taskTitleInput') taskTitleInput: ElementRef;
  @ViewChild('taskTempleteVar') taskTempleteVar: ElementRef;

  columns: Column[];

  selectedColumnTitle: string;
  openTask: boolean;
  selectedTask: Task;
  selectedTaskTitle: string;

  constructor(private boardService: BoardService, private authService: AuthService, private renderer: Renderer2) { }

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

  moveColumn(prevColumnIndex: number, newColumnIndex: number) {
    let movingColumn = this.columns.find(column => column.position === prevColumnIndex);

    this.boardService.moveColumn(movingColumn._id, prevColumnIndex, newColumnIndex).subscribe(res => {
      console.log(res);
    });

    let prevColumnToMove = this.columns.filter(prevColumn => prevColumn.position > prevColumnIndex);
    prevColumnToMove.forEach(prevColumn => {
      prevColumn.position--;
    });

    let newTasksToMove = this.columns.filter(newColumn => newColumn.position >= newColumnIndex && newColumn._id !== movingColumn._id);
    newTasksToMove.forEach(newColumn => {
      newColumn.position++;
    });

    movingColumn.position = newColumnIndex;
  }

  deleteColumn(columnId: string) {
    let deletingColumn = this.columns.find(column => column._id === columnId);

    this.boardService.deleteColumn(columnId).subscribe(res  => {
      console.log(res);
    });

    let movingColumns = this.columns.filter(column => column.position > deletingColumn.position);
    movingColumns.forEach((column) => {
      column.position--;
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
        this.boardService.renameTask(this.selectedTask, newTitle).subscribe(res => {
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

  moveTask(prevColumnId: string, newColumnId: string, prevColumnIndex: number, newColumnIndex: number, taskId: string,
          prevTasks: Task[], newTasks: Task[]) {
    this.boardService.moveTask(prevColumnId, newColumnId, prevColumnIndex, newColumnIndex, taskId).subscribe(res => {
      console.log(res);
    });
    
    // Changing the values in the frontend
    let movingTask = newTasks.find(task => task._id === taskId);

    let prevTasksToMove = prevTasks.filter(prevTask => prevTask.position > prevColumnIndex);
    prevTasksToMove.forEach(prevTask => {
      prevTask.position--;
    });

    let newTasksToMove = newTasks.filter(newTask => newTask.position >= newColumnIndex && newTask._id !== movingTask._id);
    newTasksToMove.forEach(newTask => {
      newTask.position++;
    });

    movingTask.position = newColumnIndex;
    movingTask._columnId = newColumnId;
  }

  deleteTask() {
    this.boardService.deleteTask(this.selectedTask).subscribe(res  => {
      console.log(res);
    });

    this.columns.forEach((column) => {
      if (column._id === this.selectedTask._columnId) {
        column.tasks = column.tasks.filter(task => task._id !== this.selectedTask._id);
        let movingTasks = column.tasks.filter(task => task.position > this.selectedTask.position);
        movingTasks.forEach(task => {
          task.position--;
        });
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

  dropColumn(event: CdkDragDrop<any>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    this.moveColumn(event.previousIndex, event.currentIndex);
  }

  dropTask(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.tasks, event.previousIndex, event.currentIndex);

      this.moveTask(event.previousContainer.data.columnId, event.container.data.columnId,
        event.previousIndex, event.currentIndex,
        event.container.data.tasks[event.currentIndex]._id,
        event.container.data.tasks, event.container.data.tasks);
    }
    else {
      transferArrayItem(event.previousContainer.data.tasks, event.container.data.tasks,
                        event.previousIndex, event.currentIndex);

      this.moveTask(event.previousContainer.data.columnId, event.container.data.columnId,
        event.previousIndex, event.currentIndex,
        event.container.data.tasks[event.currentIndex]._id,
        event.previousContainer.data.tasks, event.container.data.tasks);
    }
  }

  startDrag(e) {
    let preview = new ElementRef<HTMLElement>(document.querySelector(".cdk-drag.cdk-drag-preview"));
    if (this.taskTempleteVar && e.source.element.nativeElement.id === this.taskTempleteVar.nativeElement.id) {
      this.renderer.addClass(preview.nativeElement, 'task');
    }
    else {
      this.renderer.addClass(preview.nativeElement, 'board-column-placeholder');
    }
  }
}
