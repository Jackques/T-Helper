import { PersonAction } from "../personAction.enum";


export interface SubmitAction {
  submitType: PersonAction | undefined;
  personId: string;
}
