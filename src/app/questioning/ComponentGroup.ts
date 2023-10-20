import { Textbox } from './Textbox';

export interface ComponentGroup {
  id: number;
  eventId: number;
  textbox: Textbox[];
  auditColumns: string;
  uniqueId: string;
  rowVersion: string;
}
