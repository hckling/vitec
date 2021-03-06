import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';
import { CustomerService } from './components/customer/customer.service';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        BrowserModule,
        AppModuleShared,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        CustomerService
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
