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

 employees:IEmployee[]=[];//ovako je procitalo direktno iz apija

 uniqueEmployees:string[]=[]; 
employeesHours:IEmployeeHours[]=[]; //ovde ces upisati parove koji ce se prikazati u tabeli


  readonly APIUrl='https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private httpClient:HttpClient ) {
  }

  ngOnInit(): void {
  this.getEmployees();

 
  }

  getEmployees() {
    //fetch
     this.httpClient.get<IEmployee[]>(this.APIUrl).subscribe(response => {
      console.log(response);
      this.employees=response;
      
      //calculate time difference for every object- every record for every employee
     for(let e of this.employees){
      let startDate=new Date(e.StarTimeUtc);
      let endDate=new Date(e.EndTimeUtc);
      let diff = endDate.valueOf() - startDate.valueOf();
      let diffInHours = diff/1000/60/60; //to be in hours 
      e.Difference=diffInHours;
      }
    //this code return an array of unique names
      this.uniqueEmployees = [... new Set(this.employees.map(data => data.EmployeeName))];
      //set to new array values for employees names
      for(let i=0;i<this.uniqueEmployees.length;i++){
       let emp={EmployeeName: this.uniqueEmployees[i], Hours:0};
       this.employeesHours.push(emp);
      }
     //now I got my array half ready for table content

     //To get sum of time for each employee
     for(let eu of this.employeesHours){
      let hours=0;
      for(let e of this.employees){
        if(e.EmployeeName===eu.EmployeeName){
          hours+=e.Difference;
        }
       }
       eu.Hours=Math.round(hours);

     }
     
      
  }
     )
  }



 }
