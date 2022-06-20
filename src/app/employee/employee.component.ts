import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
Chart.register(...registerables);

export interface IEmployee {
  Id: string,
  EmployeeName: string,
  StarTimeUtc: string,
  EndTimeUtc: string,
  EntryNotes: string,
  DeletedOn: string,
  Difference: number
}
export interface IEmployeeHours {
  EmployeeName: string,
  Hours: number,
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {

  employees: IEmployee[] = [];//from API
  uniqueEmployees: string[] = []; //for unique names
  employeesHours: IEmployeeHours[] = []; //for table content
  times: number[] = [];
  sortedEmployees: string[] = [];
  PieChart = [];

  readonly APIUrl = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private httpClient: HttpClient) {
  }
  ngOnInit(): void {
    this.getEmployees();
  }

  //Get Employess from API and make content for table
  getEmployees() {
    //fetch
    this.httpClient.get<IEmployee[]>(this.APIUrl).subscribe(response => {
      console.log(response);
      this.employees = response;
      this.calculateDifferenceForEmployee();
      this.findUniqueEmployeeNames();
      this.pushDataIntoEmployeeHoursArray();
      this.sortEmployees();
      this.coloring();
      this.createChart()
    }
    )
  }
  //Calculate time difference for every object- every record for every employee
  calculateDifferenceForEmployee() {
    for (let e of this.employees) {
      let startDate = new Date(e.StarTimeUtc);
      let endDate = new Date(e.EndTimeUtc);
      let diff = endDate.valueOf() - startDate.valueOf();
      let diffInHours = diff / 1000 / 60 / 60; //to be in hours 
      e.Difference = diffInHours;
    }
  }
  //Return an array of unique names
  findUniqueEmployeeNames() {
    this.uniqueEmployees = [... new Set(this.employees.map(data => data.EmployeeName))];
  }

  //Calculate data for table content
  pushDataIntoEmployeeHoursArray() {
    //set to new array values for employees names
    for (let i = 0; i < this.uniqueEmployees.length; i++) {
      let emp = { EmployeeName: this.uniqueEmployees[i], Hours: 0 };
      this.employeesHours.push(emp);
    }

    //To get sum of time for each employee
    for (let eu of this.employeesHours) {
      let hours = 0;
      for (let e of this.employees) {
        if (e.EmployeeName === eu.EmployeeName) {
          hours += e.Difference;

        }
      }
      eu.Hours = Math.round(hours);
      this.times.push(eu.Hours);
    }

  }

  //Sort employees by time
  sortEmployees() {
    this.employeesHours.sort((a, b) => (a.Hours > b.Hours ? -1 : 1));
    this.employeesHours.pop(); //because name is null
    this.times.sort((a, b) => (a > b ? -1 : 1));
    for (let i = 0; i < this.employeesHours.length; i++) {
      this.sortedEmployees.push(this.employeesHours[i].EmployeeName);
    }

  }


  //Set color of row based on time
  coloring() {

  }
  createChart() {
    let ctx = document.getElementById('employeesChart');

    const employeesChart = new Chart('employeesChart', {
      type: 'pie',
      data: {
       // labels: [this.sortedEmployees[0], this.sortedEmployees[1], this.sortedEmployees[2], this.sortedEmployees[3],],
       labels:this.sortedEmployees,
        datasets: [{
          label: 'Chart',
          //data: [this.times[0], this.times[1], this.times[2], this.times[3]],
          data: this.times,
          backgroundColor: [
            'rgb(160, 56, 34 )',
            'rgb(199, 110, 243)',
            'rgb(118, 53, 151 )',
            'rgb(205, 245, 98 )',
            'rgb(120, 56, 34 )',
            'rgb(149, 110, 243)',
            'rgb(115, 53, 151 )',
            'rgb(255, 245, 98 )',
            'rgb(167, 56, 34 )',
            'rgb(193, 110, 243)',
          
           

          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

