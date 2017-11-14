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

    private btnNext: HTMLInputElement;
    private btnPrev: HTMLInputElement;
    
    ngOnInit(): void {
        this.itemCountOptions.push(10);
        this.itemCountOptions.push(50);
        this.itemCountOptions.push(100);

        this.customerService.getPage(0, this.itemsPerPage, this.customerFilter).subscribe(page => this.customerPage = page);
    }

    constructor(private customerService: CustomerService) { }

    private getPage(pageNumber: number) {
        this.customerService.getPage(pageNumber, this.itemsPerPage, this.customerFilter).subscribe(page => this.customerPage = page);       
        this.updateButtonAvailability();
    }

    private updateButtonAvailability() {
        this.getNextPageButton().disabled = (this.customerPage.pageNumber + 1) >= this.customerPage.totalPageCount;
        this.getPrevPageButton().disabled = this.customerPage.pageNumber == 0;
    }

    public getNextPageButton() {
        if (!this.btnNext) {
            this.btnNext = <HTMLInputElement>document.getElementById("btnNextPage");
        }     

        return this.btnNext;
    }

    public getPrevPageButton() {
        if (!this.btnPrev) {
            this.btnPrev = <HTMLInputElement>document.getElementById("btnPrevPage");
        }

        return this.btnPrev;
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