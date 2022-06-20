import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';



export interface IEmployee {
  Id: string,
  EmployeeName: string,
  StarTimeUtc: string,
  EndTimeUtc: string,
  EntryNotes: string,
  DeletedOn: string,
  Difference:number
}
export interface IEmployeeHours{
  EmployeeName: string,
  Hours: number,
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

 export class EmployeeComponent implements OnInit {

 employees:IEmployee[]=[];

 uniqueEmployees:IEmployee[]=[]; //ovako je procitalo direktno iz apija
employeesHours:IEmployeeHours[]=[]; //ovde ces upisati parove koji ce se prikazati u tabeli


  readonly APIUrl='https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private httpClient:HttpClient ) {
  }

  ngOnInit(): void {
  this.getEmployees();

 
  }

  getEmployees() {
     this.httpClient.get<IEmployee[]>(this.APIUrl).subscribe(response => {
      console.log(response);
      this.employees=response;
      
  for(let e of this.employees){
      let startDate=new Date(e.StarTimeUtc);
      let endDate=new Date(e.EndTimeUtc);
      let diff = endDate.valueOf() - startDate.valueOf();
      let diffInHours = diff/1000/60/60; 
      e.Difference=diffInHours;
      
    }
  });
   
  }

  filter(){
    for(let e in this.employees){
     console.log(e);
    }
  }

 

}
