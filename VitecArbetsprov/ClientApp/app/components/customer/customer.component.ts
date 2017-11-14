import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http'
import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    moduleId: 'module.id',
    selector: 'customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent {
    customer = new Customer(0, '', '', '', '');
    
    constructor(private customerService: CustomerService) { }
    
    public createCustomer() {
        if (!this.customer) {
            return
        }

        this.customerService.addCustomer(this.customer);
    }
}