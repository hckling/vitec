import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Customer } from './customer';

@Component({
    moduleId: 'module.id',
    selector: 'create-customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent {
    public result: string;
    public customer: Customer = new Customer(0, '', '', '', '');
    
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) { }
    
    public createCustomer() {
        let body = JSON.stringify(this.customer);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post(this.baseUrl + '/customer/create', body, options).subscribe(response => { this.result = 'Created user successfully!' }, error => console.error(error));
    }
}