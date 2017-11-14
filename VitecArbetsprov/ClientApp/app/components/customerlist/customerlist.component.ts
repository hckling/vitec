import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Customer } from '../customer/customer';

@Component({
    selector: 'customers',
    templateUrl: './customerlist.component.html'
})
export class CustomerListComponent {
    public customerPage: CustomerPage = new CustomerPage();
    public itemsPerPage: number = 10;
    public filter: string = "";

    private _http: Http;
    private _baseUrl: string;
    
    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        this._http = http;
        this._baseUrl = baseUrl;
        this.getPage(0);
    }

    private getPage(pageNumber: number) {
        this._http.get(this._baseUrl + '/customer/getpagefiltered?resultsPerPage=' + this.itemsPerPage + '&page=' + pageNumber + '&filter=' + this.filter).subscribe(result => {
            this.customerPage = result.json() as CustomerPage;
            (<HTMLInputElement>document.getElementById("btnNextPage")).disabled = (this.customerPage.pageNumber + 1) >= this.customerPage.totalPageCount;
            (<HTMLInputElement>document.getElementById("btnPrevPage")).disabled = this.customerPage.pageNumber == 0;
        }, error => console.error(error));
    }

    public showDetails(id: number) {
        console.debug(id);
    }

    public delete(id: number) {
        this._http.get(this._baseUrl + '/customer/delete?id=' + id).subscribe(result => {
            this.getPage(this.customerPage.pageNumber);
        }, error => console.error(error));
    }

    public nextPage() {
        this.getPage(this.customerPage.pageNumber + 1);
    }
    
    public previousPage() {
        if (this.customerPage.pageNumber > 0) {
            this.getPage(this.customerPage.pageNumber - 1);
        }
    }

    private getCurrentPageNumber() {
        if (!this.customerPage) {
            return 0;
        } else {
            return this.customerPage.pageNumber;
        }
    }

    public applyFilter() {
        this.filter = (<HTMLInputElement>document.getElementById('filter')).value;
        console.debug(this.filter);
        this.getPage(0);
    }
}

class CustomerPage {
    public customers: Customer[];
    public pageNumber: number;
    public totalPageCount: number;
}