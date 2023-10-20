import { Answer } from './Answer';
import { ComponentGroup } from './ComponentGroup';
import { Textbox } from './Textbox';

export interface Event {
  id: number;
  title: string;
  desription: string;
  location: string;
  files: string;
  startOfEvent: string;
  endOfEvent: string;
  registrationDeadline: string;
  textbox: Textbox[];
  componentGroup: ComponentGroup[];
  uniqueId: string;
  rowVersion: string;
}
