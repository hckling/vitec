import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Customer } from './customer';

@Injectable()
export class CustomerService {
    private _customerUrl: string;
    
    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this._customerUrl = baseUrl + '/customer';
    }

    getCustomerPage(page: number, resultsPerPage: number, filter: string = ""): Observable<Customer[]> {
        this._http.get(this._customerUrl + '/getallfiltered?resultsPerPage=' + resultsPerPage + '&page=' + page + '&filter=' + filter).subscribe((response: Response) => {
            return <Customer[]>response.json();
        }, error => console.error(error));

        return new Observable<Customer[]>();
    }

    addCustomer(customer: Customer) {
        let body = JSON.stringify(customer);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this._customerUrl + '/create', body, options).subscribe(result => {
            return result.json() as Customer;
        }, error => console.error(error));
    }
}