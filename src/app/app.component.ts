import { Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';
import { concat, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('full-calendar') calendar: Calendar;
  title = 'poc-angular-fullcalendar-nexsis';
  eventsId: number = 0;
  calendarOptions: CalendarOptions = {
    initialView: 'resourceTimelineDay',
    eventOverlap: false,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
    },
    timeZone: 'UTC',
    aspectRatio: 1.5,
    editable: true,
    selectable: true,
    select: this.handleSelectDates.bind(this),
    eventStartEditable: true,
  };

  constructor(
    private http: HttpClient
  ) {
    
    this.getAgents().subscribe((res) => {
      this.calendarOptions.resources = res;
    })
  }
  handleSelectDates(args: any): void {
    // if no events yet, this.calendarOptions.events is undefined
    if(this.calendarOptions.events !== undefined) {
      const oldEvents = this.calendarOptions.events;
      this.calendarOptions.events = ([] as any[]).concat(oldEvents, [{
        id: `${this.eventsId}`,
        resourceId: args.resource.id,
        title: "test " + this.eventsId,
        start: args.start,
        end: args.end
      }])
    } else {
      this.calendarOptions.events = [{
        id: `${this.eventsId}`,
        resourceId: args.resource.id,
        title: "test " + this.eventsId,
        start: args.start,
        end: args.end
      }]
    }
    this.eventsId++;
  }

  getAgents(): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/agents`).pipe(
      map(res => {
        const resourceArray = res.map((agent: any, index: number) => {
          return {
            "id": index,
            "title": agent.name
          };
        })
        return resourceArray
      })
    );
  }
  ngOnInit(): void {
  }
  
}
