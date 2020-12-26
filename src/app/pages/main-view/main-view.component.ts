import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { BoardService } from '../../core/board.service';
import { AuthService } from 'src/app/core/auth.service';
import { EditTaskComponent } from 'src/app/popup-modals/edit-task/edit-task.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  @ViewChild('taskTempleteVar') taskTempleteVar: ElementRef;
  @ViewChild('editTask') editTask: EditTaskComponent;

  popUpTemplate: string;
  openModal: boolean;

  columns: Column[];

  selectedColumn: Column;
  selectedTask: Task;
  selectedTaskTitle: string; // Needs a separate variable for the task title to handle undefined errors

  constructor(private boardService: BoardService, private authService: AuthService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.boardService.getColumns().subscribe((columns: Column[]) => {
      this.columns = columns; 

      // Getting the tasks inside of each column from the server and assigning the tasks to the column for the frontend
      this.columns.forEach(column => {
        this.boardService.getTasks(column._id).subscribe((tasks: Task[]) => {
          column.tasks = tasks;
          column.isTitleSelected = false;
        });
      });
    });

    this.openModal = false;
  }

  openCreateColumnModal() {
    this.popUpTemplate = "NewColumnComponent";
    this.openModal = true;
  }

  openCreateTaskModal(column: Column) {
    this.popUpTemplate = "NewTaskComponent";
    this.selectedColumn = column;
    this.openModal = true;
  }

  openEditTaskModal(task: Task, column: Column) {
    this.popUpTemplate = "EditTaskComponent";
    this.selectedTask = task;
    this.selectedTaskTitle = this.selectedTask.title
    this.selectedColumn = column;
    this.openModal = true;

    if (this.editTask && this.editTask.completedCheckbox)
      this.editTask.completedCheckbox.nativeElement.checked = this.selectedTask.completed ? 'checked':null;
  }

  closeModal() {
    this.openModal = false;
  }

  selectColumnTitle(column: Column) {
    column.isTitleSelected = true;
  }

  renameColumn(column: Column, newTitle: string) {
    // Update the column title if the new title is not the same as the old title
    if (column.title !== newTitle) {
      this.boardService.renameColumn(newTitle, column._id).subscribe(res => {
        console.log(res);
      });

      column.title = newTitle;
    }

    column.isTitleSelected = false;
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

  dropColumn(event: CdkDragDrop<any>) {
    this.moveColumn(event.previousIndex, event.currentIndex);
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  deleteColumn(deletingColumn: Column) {
    this.boardService.deleteColumn(deletingColumn._id).subscribe(res => {
      console.log(res);
    });

    let movingColumns = this.columns.filter(column => column.position > deletingColumn.position);
    movingColumns.forEach(column => {
      column.position--;
    });

    this.columns = this.columns.filter(column => column._id !== deletingColumn._id);
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

  deleteTask() {
    this.boardService.deleteTask(this.selectedTask).subscribe(res  => {
      console.log(res);
    });

    this.columns.forEach(column => {
      if (column._id === this.selectedTask._columnId) {
        column.tasks = column.tasks.filter(task => task._id !== this.selectedTask._id);
        let movingTasks = column.tasks.filter(task => task.position > this.selectedTask.position);
        movingTasks.forEach(task => {
          task.position--;
        });
        return false;
      }
    });

    this.openModal = false;
  }

  startDrag(e: any) {
    let preview = new ElementRef<HTMLElement>(document.querySelector(".cdk-drag.cdk-drag-preview"));
    if (this.taskTempleteVar && e.source.element.nativeElement.id === this.taskTempleteVar.nativeElement.id) {
      this.renderer.addClass(preview.nativeElement, 'task');
    }
    else {
      this.renderer.addClass(preview.nativeElement, 'board-column-placeholder');
    }
  }

  logout() {
    this.authService.logout();
  }
}