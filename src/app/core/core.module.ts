import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BoardService } from './board.service';
import { WebRequestService } from './web-request.service';
import { AuthService } from './auth.service';
import { WebRequestInterceptorService } from './web-request-interceptor.service';

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ BoardService, WebRequestService, AuthService, WebRequestInterceptorService ]
})
export class CoreModule { }