import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event2 } from '../app.component';
import { Router } from '@angular/router';
import { Event } from './Event';
@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class main {
  public rowData: { Veranstaltungen: Event2[] } = { Veranstaltungen: [] };
  public filterdData: Event2[] = [];
  searchInput: string = '';
  partChecked: boolean = false;
  mineChecked: boolean = false;
  allChecked: boolean = true;
  timeLeftChecked: boolean = false;
  overdueChecked: boolean = false;
  allSituationChecked: boolean = true;
  answerChecked: boolean = false;
  noAnswerChecked: boolean = false;
  allStatesChecked: boolean = true;
  sortBy: string | null = null;
  answer: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.http
      .get<Event[]>('assets/realData.json')
      .subscribe((data: Event[]) => {
        data.forEach((element) => {
          this.answer = false;
          if (element.textbox.length !== 0) {
            element.textbox.forEach((elementT) => {
              if (elementT.answer.length !== 0) {
                this.answer = true;
              }
            });
          }
          if (element.componentGroup.length !== 0) {
            element.componentGroup.forEach((elementT) => {
              elementT.textbox.forEach((element) => {
                if (element.answer.length !== 0) {
                  this.answer = true;
                }
              });
            });
          }
          this.rowData.Veranstaltungen.push({
            Titel: element.title,
            Datum: element.startOfEvent + '  -  ' + element.endOfEvent,
            Antwort: this.answer,
            AnmeldeFrist: element.registrationDeadline,
            Herkunft: element.location,
            Matches: 0,
            Changes: 0,
          });
        });

        this.addAllEvents();
        const curentTime = this.getCurrentDayAndTime();
        this.filterdData.forEach(async (element) => {
          let dateFromEvent = '';
          let years: string[] = element.AnmeldeFrist.split('T');
          years = years[0].split('-');
          dateFromEvent = years[0] + years[1] + years[2];
          // if (Number(curentTime) === Number(dateFromEvent)) {
          //   window.alert(
          //     'Sie müssen heute noch ' +
          //       element.Titel +
          //       ' ausfüllen den es Läuft heute ab.'
          //   );
          // }
          // if (Number(curentTime) > Number(dateFromEvent)) {
          //   window.alert(
          //     'Gestern ist die Anmelde Frist von ' +
          //       element.Titel +
          //       ' abgelaufen.'
          //   );
          // }
        });
        this.sortDataByDate();
      });
  }
  sortDataByDate() {
    this.filterdData.sort((a, b) => {
      const dateA: any = new Date(a.AnmeldeFrist);
      const dateB: any = new Date(b.AnmeldeFrist);
      return dateA - dateB;
    });
  }
  addAllEvents() {
    this.rowData.Veranstaltungen.forEach((element) => {
      this.filterdData.push({
        Titel: element.Titel,
        Datum: element.Datum,
        Antwort: element.Antwort,
        AnmeldeFrist: element.AnmeldeFrist,
        Herkunft: element.Herkunft,
        Matches: 0,
        Changes: 0,
      });
    });
  }

  addEvent(element: Event2) {
    this.filterdData.push({
      Titel: element.Titel,
      Datum: element.Datum,
      Antwort: element.Antwort,
      AnmeldeFrist: element.AnmeldeFrist,
      Herkunft: element.Herkunft,
      Matches: element.Matches,
      Changes: element.Changes,
    });
  }
  search() {
    const secondFilterdList = this.filterdData;
    this.filterdData = [];
    secondFilterdList.forEach((element) => {
      this.addEventBySearch(element);
    });
    this.sortFilteredEmployeeByPercent();
  }

  addEventBySearch(event: Event2) {
    const nameOfEvent = event.Titel;
    const comparedStrings = this.compareStrings(nameOfEvent, this.searchInput);
    if (
      1 <= comparedStrings.maxMatches &&
      comparedStrings.differentLetters <= nameOfEvent.length
    ) {
      this.addEvent(event);
    }
  }

  sortFilteredEmployeeByPercent() {
    this.filterdData.sort((a, b) => a.Changes - b.Changes);
    this.filterdData.sort((a, b) => b.Matches - a.Matches);
  }

  compareStrings(string1: string, string2: string) {
    let maxMatches = 0;
    let minCombinedLength = string1.length + string2.length + 1;
    let string2Range = [];
    for (let i = 0 - string1.length; i <= -1; i++) {
      string2Range.push(i);
    }
    let string1Range = Array.from({ length: string1.length }, (_, i) => i);
    while (string2Range[0] <= string1Range[string1Range.length - 1] + 1) {
      let matches = 0;
      const shift = string1Range[0] - string2Range[0];
      const startOverlap = Math.max(string1Range[0], string2Range[0]);
      const endOverlap = Math.min(
        string1Range[string1Range.length - 1] + 1,
        string2Range[string2Range.length - 1] + 1
      );
      const overlap = Array.from(
        { length: endOverlap - startOverlap },
        (_, i) => i + startOverlap
      );

      for (const i of overlap) {
        if (string1[i] === string2[i + shift]) {
          matches += 1;
        }
      }
      const combinedLength = string1.length + string2.length - overlap.length;
      if (matches > maxMatches) {
        maxMatches = matches;
        minCombinedLength = combinedLength;
      }
      string2Range = string2Range.map((value) => value + 1);
    }

    const differentLetters = minCombinedLength - maxMatches;
    return { differentLetters, maxMatches };
  }
  filter(event: any) {
    this.searchInput = '';
    this.filterdData = [];
    const herkunft = event.srcElement.name;

    if (event.target.checked) {
      if (herkunft === 'mine') {
        this.mineChecked = true;
        this.allChecked = false;
        this.partChecked = false;
      }
      if (herkunft === 'allEvents') {
        this.allChecked = true;
        this.mineChecked = false;
        this.partChecked = false;
      }
      if (herkunft === 'part') {
        this.partChecked = true;
        this.mineChecked = false;
        this.allChecked = false;
      }

      if (herkunft === 'overdue') {
        this.overdueChecked = true;
        this.allSituationChecked = false;
        this.timeLeftChecked = false;
      }
      if (herkunft === 'allSituation') {
        this.allSituationChecked = true;
        this.timeLeftChecked = false;
        this.overdueChecked = false;
      }
      if (herkunft === 'timeLeft') {
        this.timeLeftChecked = true;
        this.allSituationChecked = false;
        this.overdueChecked = false;
      }

      if (herkunft === 'answer') {
        this.answerChecked = true;
        this.allStatesChecked = false;
        this.noAnswerChecked = false;
      }
      if (herkunft === 'allStates') {
        this.allStatesChecked = true;
        this.answerChecked = false;
        this.noAnswerChecked = false;
      }
      if (herkunft === 'noAnswer') {
        this.noAnswerChecked = true;
        this.answerChecked = false;
        this.allStatesChecked = false;
      }

      if (this.allChecked === true) {
        this.addAllEvents();
      }
      if (this.partChecked === true) {
        this.rowData.Veranstaltungen.forEach((element) => {
          if (element.Herkunft !== 'von mir') {
            this.filterdData.push(element);
          }
        });
        this.partChecked = true;
        this.allChecked = false;
      }
      if (this.mineChecked === true) {
        this.rowData.Veranstaltungen.forEach((element) => {
          if (element.Herkunft === 'von mir') {
            this.filterdData.push(element);
          }
        });
        this.mineChecked = true;
      }
      const copyOfFilterd = this.filterdData;
      if (this.overdueChecked === true || this.timeLeftChecked === true) {
        this.filterdData = [];
      }
      const curentTime = this.getCurrentDayAndTime();
      if (this.overdueChecked === true) {
        copyOfFilterd.forEach(async (element) => {
          let dateFromEvent = '';
          let years: string[] = element.AnmeldeFrist.split('T');
          years = years[0].split('-');
          dateFromEvent = years[0] + years[1] + years[2];
          if (Number(curentTime) > Number(dateFromEvent)) {
            this.addEvent(element);
          }
        });
      }
      if (this.timeLeftChecked === true) {
        copyOfFilterd.forEach(async (element) => {
          let dateFromEvent = '';
          let years: string[] = element.AnmeldeFrist.split('T');
          years = years[0].split('-');
          dateFromEvent = years[0] + years[1] + years[2];
          if (Number(curentTime) <= Number(dateFromEvent)) {
            this.addEvent(element);
          }
        });
      }

      const copyOfFilterdForStatus = this.filterdData;
      if (this.noAnswerChecked === true || this.answerChecked === true) {
        this.filterdData = [];
      }
      if (this.answerChecked === true) {
        copyOfFilterdForStatus.forEach((element) => {
          if (element.Antwort === true) {
            this.addEvent(element);
          }
        });
      }
      if (this.noAnswerChecked === true) {
        copyOfFilterdForStatus.forEach((element) => {
          if (element.Antwort === false) {
            this.addEvent(element);
          }
        });
      }
    }
    this.sortDataByDate();
  }
  editeEvent(event: any, index: number) {
    this.router.navigate(['/event', index]);
  }
  getCurrentDayAndTime() {
    var date = new Date();

    const curentDate =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2);
    return curentDate;
  }

  sortDataByTitle() {
    this.filterdData.sort((a, b) => a.Titel.localeCompare(b.Titel));
  }

  sortDataByDatum() {
    this.filterdData.sort(
      (a, b) => new Date(a.Datum).getTime() - new Date(b.Datum).getTime()
    );
  }

  sortDataByAntwort() {
    this.filterdData.sort(
      (a, b) => (a.Antwort ? 1 : -1) - (b.Antwort ? 1 : -1)
    );
  }

  sortDataByAnmeldeFrist() {
    this.filterdData.sort((a, b) =>
      a.AnmeldeFrist.localeCompare(b.AnmeldeFrist)
    );
  }

  sortDataByHerkunft() {
    this.filterdData.sort((a, b) => a.Herkunft.localeCompare(b.Herkunft));
  }

  sortTable(column: string) {
    if (column === this.sortBy) {
      this.filterdData.reverse();
    } else {
      this.sortBy = column;
      switch (column) {
        case 'Titel':
          this.sortDataByTitle();
          break;
        case 'Datum':
          this.sortDataByDatum();
          break;
        case 'Antwort':
          this.sortDataByAntwort();
          break;
        case 'AnmeldeFrist':
          this.sortDataByAnmeldeFrist();
          break;
        case 'Herkunft':
          this.sortDataByHerkunft();
          break;
      }
    }
  }
}
