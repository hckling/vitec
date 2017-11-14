import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http'

@Component({
    templateUrl: './customer.component.html'
})
export class CustomerComponent {
    public id: number = 0;
    public firstName: string = "";
    public lastName: string = "";
    public socialSecurityNumber: string = "";
    public category: string = "";

    private _http: Http;
    private _baseUrl: string;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        this._http = http;
        this._baseUrl = baseUrl;
    }

    public delete() {
        this._http.get(this._baseUrl + '/customer/delete/' + this.id).subscribe(result => { }, error => console.error(error));
    }
}