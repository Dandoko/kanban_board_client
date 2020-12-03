import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from 'src/app/core/board.service';

@Component({
  selector: 'app-new-column',
  templateUrl: './new-column.component.html',
  styleUrls: ['./new-column.component.scss']
})
export class NewColumnComponent implements OnInit {

  constructor(private boardService: BoardService, private router: Router) { }

  ngOnInit(): void {
  }

  createColumn(title: string) {
    this.boardService.createColumn(title).subscribe(() => {
      this.router.navigateByUrl('/board');
    })
  }
}
