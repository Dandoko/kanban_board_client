import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { BoardService } from '../../core/board.service';

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

  constructor(private boardService: BoardService) { }

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

  completeTask() {
    this.boardService.completeTask(this.selectedTask).subscribe(() => {
      this.selectedTask.completed = !this.selectedTask.completed;
    });
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
