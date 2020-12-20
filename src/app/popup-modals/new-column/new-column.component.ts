import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/app/core/board.service';
import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { MainViewComponent } from 'src/app/pages/main-view/main-view.component';

@Component({
  selector: 'app-new-column',
  templateUrl: './new-column.component.html',
  styleUrls: ['./new-column.component.scss']
})
export class NewColumnComponent implements OnInit {

  @Input() mainView: MainViewComponent;
  @Input() columns: Column[];

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  createColumn(title: string) {
    this.boardService.createColumn(title).subscribe((createdColumn: Column) => {
      createdColumn.tasks = [] as Task[];
      this.columns[this.columns.length] = createdColumn;
      this.mainView.closeModal();
    })
  }
}
