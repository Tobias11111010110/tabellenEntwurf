import { Answer } from './Answer';

export interface Combined {
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
  componentGroup: boolean;
}
