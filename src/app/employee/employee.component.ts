import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { IEmployee } from './employees';



export interface IEmployee {
  Id: string,
  EmployeeName: string,
  StarTimeUtc: string,
  EndTimeUtc: string,
  EntryNotes: string,
  DeletedOn: string
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

 export class EmployeeComponent implements OnInit {

 employees=[];
  readonly APIUrl='https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor( private httpClient:HttpClient) {
  }

  ngOnInit(): void {
  this.getEmployees();
  }

  getEmployees() {
     this.httpClient.get<any>(this.APIUrl).subscribe(response => {
      console.log(response);
      this.employees=response;
    });
  }
 
}
