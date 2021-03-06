import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataSourceService {

  constructor(private http: HttpClient) { }

  getUsersDataSource(request:any): Observable<any> {
    let url = 'https://jsonplaceholder.typicode.com/users?';
    return this.getDataSource(url, request);
  }
  
  private getDataSource(url:string, request:any): Observable<any> {
    let page = request.start > 0 ? (request.start / request.length) + 1 : request.start + 1;
    url += `_page=${page}&_limit=${request.length}&`;

    request.orders.forEach((order) => {
      url += `_sort=${order.name}&_order=${order.dir.toUpperCase()}&`;
    });

    request.filters.forEach((filter) => {
      if (filter.value) {
        url += `${filter.name}_like=${filter.value}&`;
      }
    });

    if(request.fullTextFilter){
      url += `q=${request.fullTextFilter}&`;
    }

    return this.http.get(url, {observe: 'response'}).pipe(
      map(res => {
        let data = res.body;
        let count = res.headers.get('x-total-count');
        return {
          recordsTotal: count,
          recordsFiltered: count,
          data: data
        };
      })
    );
  }
}
