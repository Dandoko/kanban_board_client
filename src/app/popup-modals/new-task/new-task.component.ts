import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/app/core/board.service';
import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { MainViewComponent } from 'src/app/pages/main-view/main-view.component';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @Input() mainView: MainViewComponent;
  @Input() columnId: string
  @Input() column: Column;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  createTask(title: string) {
    this.boardService.createTask(title, this.columnId).subscribe((createdTask: Task) => {
      this.column.tasks[this.column.tasks.length] = createdTask;
      this.mainView.closeModal();
    });
  }
}
