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
  lengthOfCG: number = 0;

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
            this.componentGrouptextbox = element.textbox;
          }
        );
        this.componentGrouptextbox.forEach((element) => {
          if (element.answer.length === 0) {
            this.answersCG.push('');
          } else {
            element.answer.forEach((element) => {
              this.answersCG.push(element.answers);
            });
          }
        });
        this.listOfTextbox.forEach((element) => {
          if (element.answer.length === 0) {
            this.answersTextbox.push('');
          } else {
            element.answer.forEach((element) => {
              this.answersTextbox.push(element.answers);
            });
          }
        });
        this.lengthOfCG = this.componentGrouptextbox.length;
      });
  }
  save() {
    let answers: any = [];
    this.answersTextbox.forEach((element) => {
      answers.push(element);
    });
    console.log(this.answersTextbox);

    this.answersCG.forEach((element) => {
      answers.push(element);
    });
    console.log(this.answersCG);

    console.log('✌️answers --->', answers);
    this.router.navigate(['/']);
  }
  expand() {
    for (let index = 0; index < this.lengthOfCG; index++) {
      const element = this.componentGrouptextbox[index];
      this.componentGrouptextbox.push(element);
    }
  }
  subtract() {
    this.componentGrouptextbox.splice(
      this.componentGroup.length - this.lengthOfCG,
      this.lengthOfCG
    );
  }
}
