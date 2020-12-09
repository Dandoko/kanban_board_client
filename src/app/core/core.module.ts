import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BoardService } from './board.service';
import { WebRequestService } from './web-request.service';
import { AuthService } from './auth.service';
import { WebRequestInterceptorService } from './web-request-interceptor.service';

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ BoardService, WebRequestService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: WebRequestInterceptorService, multi: true} ]
})
export class CoreModule { }