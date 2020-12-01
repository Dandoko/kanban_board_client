import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Board } from "../../models/board.model";
import { Column } from 'src/app/models/column.model';
import { BoardService } from '../../core/board.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(private boardService: BoardService) { }

  createNewColumn() {
    this.boardService.createColumn('Testing').subscribe((res) => {
      console.log(res);
    })
  }

  board: Board = new Board('Test Board', [
    new Column('To Do', [
      "Some random Idea",
      "This is another random idea",
      "Build an awesome app"
    ]),
    new Column('In Progress', [
      "123",
      "abc",
      "wasd"
    ]),
    new Column('Under Review', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ]),
    new Column('Complete', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ])
  ]);

  ngOnInit(): void {
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
