import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Column } from 'src/app/models/column.model';
import { BoardService } from '../../core/board.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  columns: Column[];

  constructor(private boardService: BoardService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.boardService.getColumns().subscribe((columns: Column[]) => {
      this.columns = columns; 

      // Getting the tasks inside of each column from the server and assigning the tasks to the column for the frontend
      this.columns.forEach((column) => {
        this.boardService.getTasks(column._id).subscribe((tasks: any[]) => {
          column.tasks = tasks;
        });
      });
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
