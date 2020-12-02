import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BoardService } from './board.service';
import { WebRequestService } from './web-request.service';

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ BoardService, WebRequestService ]
})
export class CoreModule { }