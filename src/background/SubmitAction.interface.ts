import { PersonAction } from "../peronAction.enum";


export interface SubmitAction {
  submitType: PersonAction | undefined;
  personId: string;
}
