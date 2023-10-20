import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { main } from './main/main.component';
import { QuestioningComponent } from './questioning/questioning.component';

const routes: Routes = [
  {
    path: '',
    component: main,
  },
  {
    path: 'event/:id',
    component: QuestioningComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
