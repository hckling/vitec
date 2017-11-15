import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { Customer } from './customer';
import { CustomerPage } from '../customerlist/customerpage';
import { CustomerFilter } from '../customerlist/customerfilter';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'

@Injectable()
export class CustomerService {
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) { }

    private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if (err instanceof Response) {
            return Observable.throw(err.json() || 'backend server error');            
        }
        return Observable.throw(err || 'backend server error');
    }

    getPage(page: number, itemsPerPage: number, filter: CustomerFilter): Observable<CustomerPage> {
        let body = JSON.stringify(filter);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let resultPage = new CustomerPage();

        return this.http.post(this.baseUrl + '/customer/getpagefiltered?resultsPerPage=' + itemsPerPage + '&page=' + page, body, options)
            .map(result => result.json() as CustomerPage)
            .catch(this._serverError);
    }

    delete(id: number): Observable<any> {
        return this.http.get(this.baseUrl + '/customer/delete?id=' + id);
    }

    saveChanges() {
        this.http.get(this.baseUrl + '/customer/savechanges').subscribe(result => { }, error => { console.debug("Heyaaaa!"); console.error(error); });
    }

    addCustomer(customer: Customer): Observable<Customer> {
        let body = JSON.stringify(customer);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl + '/customer/create', body, options).map(result => result.json() as Customer);
    }
}