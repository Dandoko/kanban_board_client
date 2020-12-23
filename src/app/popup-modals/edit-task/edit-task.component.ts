import { Attribute, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from 'src/app/core/board.service';
import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { MainViewComponent } from 'src/app/pages/main-view/main-view.component';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  @Input() selectedTask: Task;
  @Input() selectedTaskTitle: string;
  @Input() mainView: MainViewComponent;
  @Input() column: Column;

  @ViewChild('completedCheckbox') completedCheckbox: ElementRef;

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  completeTask() {
    this.boardService.completeTask(this.selectedTask).subscribe(() => {
      this.selectedTask.completed = !this.selectedTask.completed;
    });
  }

  renameTask(newTitle: string) {
    // Update the column title if the new title is not the same as the old title
    if (this.selectedTaskTitle !== newTitle) {
      this.boardService.renameTask(this.selectedTask, newTitle).subscribe(res => {
        console.log(res);
      });

      this.selectedTask.title = newTitle;
    }

    this.mainView.closeModal();
  }

  deleteTask() {
    this.boardService.deleteTask(this.selectedTask).subscribe(res => {
      console.log(res);
    });

    this.column.tasks = this.column.tasks.filter(task => task._id !== this.selectedTask._id);
    let movingTasks = this.column.tasks.filter(task => task.position > this.selectedTask.position);
    movingTasks.forEach(task => {
      task.position--;
    });

    this.mainView.closeModal();
  }
}
