import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'customers',
    templateUrl: './customerlist.component.html'
})
export class CustomerListComponent {
    public customers: Customer[];
    public page: number = 0;
    public itemsPerPage: number = 10;
    public filter: string = "";

    private _http: Http;
    private _baseUrl: string;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        this._http = http;
        this._baseUrl = baseUrl;
        this.refreshPage();
    }

    private refreshPage() {
        if (this.filter == "") {
            this.getCurrentPage();
        } else {
            this.getCurrentPageFiltered();
        }
    }
    
    private getCurrentPage() {
        this._http.get(this._baseUrl + '/customer/getpage?resultsPerPage=' + this.itemsPerPage + '&page=' + this.page).subscribe(result => {
            this.customers = result.json() as Customer[];
        }, error => console.error(error));        
    }

    private getCurrentPageFiltered() {
        this._http.get(this._baseUrl + '/customer/getpagefiltered?resultsPerPage=' + this.itemsPerPage + '&page=' + this.page + '&filter=' + this.filter).subscribe(result => {
            this.customers = result.json() as Customer[];
        }, error => console.error(error));
    }

    public showDetails(id: number) {
        console.debug(id);
    }

    public delete(id: number) {
        this._http.get(this._baseUrl + '/customer/delete?id=' + id).subscribe(result => {
            this.refreshPage();
        }, error => console.error(error));
    }

    public nextPage() {
        this.page++;
        this.refreshPage();
    }
    
    public previousPage() {
        if (this.page > 0) {
            this.page--;
            this.refreshPage();
        }
        
    }

    public applyFilter() {
        this.filter = (<HTMLInputElement>document.getElementById('filter')).value;
        console.debug(this.filter);
        this.refreshPage();
    }
}

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    socialSecurityNumber: number;
    category: string;
}