import { Message, MessageAuthorEnum } from "../../message.interface";
import { Reminder } from "../classes/util/NeedsReminder";

describe('Test', () => {
  const singleOpenerFromMe: Message[] = [{
    "message": "1Testmessage from me to match",
    "datetime": "2021-07-17T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }];

  const singleOpenerFromMeWithReply: Message[] = [{
    "message": "1Testmessage from me to match",
    "datetime": "2021-07-17T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "1Reply from match to me",
    "datetime": "2021-07-18T07:55:00.087Z",
    "author": MessageAuthorEnum.Match
  }];

  const openerWithReplyAndResponse: Message[] = [{
    "message": "1Testmessage from me to match",
    "datetime": "2021-07-17T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "1Reply from match to me",
    "datetime": "2021-07-18T07:55:00.087Z",
    "author": MessageAuthorEnum.Match
  }, {
    "message": "2message from me to match",
    "datetime": "2021-07-19T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];

  it('Logs text', async () => {
    console.log = jest.fn();
    console.log('hi content');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('some test', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMe, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
  });

  it('some test 2', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMeWithReply, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
  });

  it('some test 3', () => {
    const reminder: Reminder = new Reminder(openerWithReplyAndResponse, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(1);
  });
});