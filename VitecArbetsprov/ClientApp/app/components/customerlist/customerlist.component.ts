import { Component, Inject, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Customer } from '../customer/customer';

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
    }
    
    constructor(private _http: Http, @Inject('BASE_URL') private _baseUrl: string) {
        this.getPage(0);
    }    

    private getPage(pageNumber: number) {
        let body = JSON.stringify(this.customerFilter);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this._http.post(this._baseUrl + '/customer/getpagefiltered?resultsPerPage=' + this.itemsPerPage + '&page=' + pageNumber, body, options).subscribe(result => {
            this.customerPage = result.json() as CustomerPage;
            this.getNextPageButton().disabled = (this.customerPage.pageNumber + 1) >= this.customerPage.totalPageCount;
            this.getPrevPageButton().disabled = this.customerPage.pageNumber == 0;
        }, error => console.error(error));
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

    public onItemsPerPageChanged() {
        this.getPage(0);
    }

    private getCurrentPageNumber() {
        if (!this.customerPage) {
            return 0;
        } else {
            return this.customerPage.pageNumber;
        }
    }

    public applyFilter() {
        this.getPage(0);
    }

    public saveChanges() {
        this._http.get(this._baseUrl + '/customer/savechanges').subscribe(result => {
            
        }, error => console.error(error));
    }
}

class CustomerFilter {
    constructor(public nameFilter: string, public ssnFilter: string, public categoryFilter: string) {

    }
}

class CustomerPage {
    public customers: Customer[];
    public pageNumber: number;
    public totalPageCount: number;
}