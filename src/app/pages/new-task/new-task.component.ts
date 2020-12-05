import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BoardService } from 'src/app/core/board.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  columnId: string;

  constructor(private boardService: BoardService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.columnId = params['columnId'];
    });
  }

  createTask(title: string) {
    this.boardService.createTask(title, this.columnId).subscribe(() => {
      this.router.navigateByUrl('/board');
    });
  }
}
