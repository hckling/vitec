import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Customer } from './customer';
import { CustomerService } from './customer.service';

@Component({
    moduleId: 'module.id',
    selector: 'create-customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent {
    public result: string;
    public customer: Customer = new Customer(0, '', '', '', '');

    constructor(private customerService: CustomerService) { }
    
    public createCustomer() {
        this.customerService.addCustomer(this.customer).subscribe(user => this.result = "Successfully created user with id=" + user.id);        
    }
}