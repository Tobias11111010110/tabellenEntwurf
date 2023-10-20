import { Component } from '@angular/core';
import { Event } from './Event';
import { ActivatedRoute } from '@angular/router';
import { Textbox } from './Textbox';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ComponentGroup } from './ComponentGroup';
import { Combined } from './Combined';

@Component({
  selector: 'app-questioning',
  templateUrl: './questioning.component.html',
  styleUrls: ['./questioning.component.css'],
})
export class QuestioningComponent {
  listOfAllEvents: Event[] = [];
  currentEventId: number = 0;
  listOfTextbox: Textbox[] = [];
  answersTextbox: any[] = [];
  answersCG: any[] = [];
  componentGroup: ComponentGroup[] = [];
  componentGrouptextbox: Textbox[] = [];
  CGTextbox: Combined[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.currentEventId = params['id'];
    });
    this.http
      .get<Event[]>('assets/realData.json')
      .subscribe((data: Event[]) => {
        this.listOfAllEvents = data;
        this.listOfTextbox = this.listOfAllEvents[this.currentEventId].textbox;
        this.listOfAllEvents[this.currentEventId].componentGroup.forEach(
          (element) => {
            element.textbox.forEach((element) => {
              this.CGTextbox.push({
                id: element.id,
                length: element.length,
                mustDo: element.mustDo,
                type: element.type,
                label: element.label,
                componentGroupId: element.componentGroupId,
                eventId: element.eventId,
                answer: element.answer,
                auditColumns: element.auditColumns,
                uniqueId: element.uniqueId,
                rowVersion: element.rowVersion,
                componentGroup: true,
              });
            });
          }
        );
        this.listOfAllEvents[this.currentEventId].componentGroup.forEach(
          (element) => {
            this.componentGrouptextbox = element.textbox;
          }
        );
        this.componentGrouptextbox.forEach((element) => {
          console.log(element.answer);
          if (element.answer.length === 0) {
            this.answersCG.push('');
          } else {
            element.answer.forEach((element) => {
              this.answersCG.push(element.answers);
            });
          }
        });
        this.listOfTextbox.forEach((element) => {
          console.log(element.answer);
          if (element.answer.length === 0) {
            this.answersTextbox.push('');
          } else {
            element.answer.forEach((element) => {
              this.answersTextbox.push(element.answers);
            });
          }
        });
        console.log(this.answersCG);
      });
  }
  save() {
    let answers: any = [];
    this.answersTextbox.forEach((element) => {
      answers.push(element);
    });
    this.answersCG.forEach((element) => {
      answers.push(element);
    });
    console.log('✌️answers --->', answers);
    this.router.navigate(['/']);
  }
}
