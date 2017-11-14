import { Component, Inject, OnInit } from '@angular/core';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/customer';
import { CustomerFilter } from './customerfilter';
import { CustomerPage } from './customerpage';

@Component({
    selector: 'customers',
    templateUrl: './customerlist.component.html'
})
export class CustomerListComponent implements OnInit {    
    public customerPage: CustomerPage = new CustomerPage();
    public customerFilter: CustomerFilter = new CustomerFilter('', '', '');

    public itemsPerPage: number = 10;
    public itemCountOptions: number[] = [];

    public atFirstPage: boolean = false;
    public atLastPage: boolean = false;
    
    ngOnInit(): void {
        // TODO: Make nicer...
        this.itemCountOptions.push(10);
        this.itemCountOptions.push(50);
        this.itemCountOptions.push(100);

        this.customerService.getPage(0, this.itemsPerPage, this.customerFilter).subscribe(page => {
            this.customerPage = page;
            this.updateButtonAvailability();
        });
    }

    constructor(private customerService: CustomerService) { }

    private getPage(pageNumber: number) {
        this.customerService.getPage(pageNumber, this.itemsPerPage, this.customerFilter).subscribe(page => {
            this.customerPage = page;
            this.updateButtonAvailability();
        });        
    }

    private updateButtonAvailability() {
        this.atLastPage = (this.customerPage.pageNumber + 1) >= this.customerPage.totalPageCount;
        this.atFirstPage = this.customerPage.pageNumber == 0;
    }    

    public delete(id: number) {
        this.customerService.delete(id).subscribe(() => this.refreshPage());
        this.customerService.getPage(0, this.itemsPerPage, this.customerFilter);
    }

    private refreshPage() {
        this.getPage(this.customerPage.pageNumber);
    }

    public nextPage() {
        this.getPage(this.customerPage.pageNumber + 1);
    }
    
    public previousPage() {
        if (this.customerPage.pageNumber > 0) {
            this.getPage(this.customerPage.pageNumber - 1);
        }
    }

    public onItemsPerPageChanged() {
        this.getPage(0);
    }

    public applyFilter() {
        this.getPage(0);
    }

    public saveChanges() {
        this.customerService.saveChanges();
    }
}