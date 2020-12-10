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
  columns: Column[];

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
  }

  completeTask(task: Task) {
    this.boardService.completeTask(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  renameColumn(columnId: string) {
    this.columns.forEach((column) => {
      if (column._id === columnId) {
        column.isTitleSelected = true;
        return false;
      }
    });
  }

  updateColumn(columnId: string, newTitle: string) {
    this.boardService.updateColumn(newTitle, columnId).subscribe(res => {
      console.log(res);
    });

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

    this.columns.forEach((column, index) => {
      if (column._id === columnId) {
        this.columns.splice(index, 1);
        return false;
      }
    });
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
