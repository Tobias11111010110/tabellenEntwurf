import { Answer } from './Answer';

export interface Textbox {
  id: number;
  length: number;
  mustDo: boolean;
  type: string;
  label: string;
  componentGroupId: number;
  eventId: number;
  answer: Answer[];
  auditColumns: string;
  uniqueId: string;
  rowVersion: string;
}
