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
    
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) { }
    
    public createCustomer() {

        // TODO: Change this to use data binding if there is time
        let firstName = (<HTMLInputElement>document.getElementById("txtFirstName")).value;
        let lastName = (<HTMLInputElement>document.getElementById("txtLastName")).value;
        let ssn = (<HTMLInputElement>document.getElementById("txtSocialSecurityNumber")).value;
        let category = (<HTMLInputElement>document.getElementById("txtCategory")).value;

        console.debug(firstName, lastName, ssn, category);

        let customer = new Customer(0, firstName, lastName, ssn, category);

        let body = JSON.stringify(customer);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post(this.baseUrl + '/customer/create', body, options).subscribe(response => { this.result = 'Created user successfully!' }, error => console.error(error));
    }
}