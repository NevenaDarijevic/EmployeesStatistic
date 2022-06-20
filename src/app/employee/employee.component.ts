import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

 employees:IEmployee[]=[];//from API
 uniqueEmployees:string[]=[]; //for unique names
 employeesHours:IEmployeeHours[]=[]; //for table content


  readonly APIUrl='https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private httpClient:HttpClient ) {
   }
  ngOnInit(): void {
  this.getEmployees();
  }

  //Get Employess from API and make content for table
  getEmployees() {
    //fetch
     this.httpClient.get<IEmployee[]>(this.APIUrl).subscribe(response => {
      console.log(response);
      this.employees=response;
      this.calculateDifferenceForEmployee();
      this.findUniqueEmployeeNames();
      this.pushDataIntoEmployeeHoursArray(); 
      this.sort();
    }
    )}
 //Calculate time difference for every object- every record for every employee
  calculateDifferenceForEmployee(){
    for(let e of this.employees){
      let startDate=new Date(e.StarTimeUtc);
      let endDate=new Date(e.EndTimeUtc);
      let diff = endDate.valueOf() - startDate.valueOf();
      let diffInHours = diff/1000/60/60; //to be in hours 
      e.Difference=diffInHours;
      }
  }
  //Return an array of unique names
  findUniqueEmployeeNames(){
    this.uniqueEmployees = [... new Set(this.employees.map(data => data.EmployeeName))];
  }

  //Calculate data for table content
  pushDataIntoEmployeeHoursArray(){
      //set to new array values for employees names
      for(let i=0;i<this.uniqueEmployees.length;i++){
        let emp={EmployeeName: this.uniqueEmployees[i], Hours:0};
        this.employeesHours.push(emp);
      }

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

    //Sort employees by time
    sort(){
      this.employeesHours.sort((a, b) => (a.Hours > b.Hours ? -1 : 1));
    }
}
 
