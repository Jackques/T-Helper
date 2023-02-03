import { Message, MessageAuthorEnum } from "../../message.interface";
import { Reminder } from "../classes/util/NeedsReminder";

describe('Needs Reminder Test', () => {
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

  const replyOnceNoResponse: Message[] = [{
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
  const replyOnceNoResponseTwoReminders: Message[] = [{
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
  }, {
    "message": "3message from me to match",
    "datetime": "2021-07-22T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];

  it('Logs text', async () => {
    console.log = jest.fn();
    console.log('hi content');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('Test - opening message no reply', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMe, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(singleOpenerFromMe)).toEqual(true);
  });

  it('Test - opening message with reply', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMeWithReply, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(singleOpenerFromMeWithReply)).toEqual(false);
  });

  it('Test - reply from match but ghost', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponse, null, null);
    expect(reminder.getReminderAmountItems().length).toEqual(1);
    expect(reminder.getNeedsReminder(replyOnceNoResponse)).toEqual(false);
  });

  //TODO TODO TODO: Experimenting with this!
  it('Test - Message but got immediate number', () => {
    const gotImmediateNumber: Message[] = [{
      "message": "1Hey, what's your number?",
      "datetime": "2021-07-17T07:55:00.087Z",
      "author": MessageAuthorEnum.Me
    }, {
      "message": "1 0123456789",
      "datetime": "2021-07-18T07:55:00.087Z",
      "author": MessageAuthorEnum.Match
    }];

    const reminder: Reminder = new Reminder(gotImmediateNumber, "2021-07-18T08:55:00.087Z", null);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(gotImmediateNumber)).toEqual(false);
  });
  it('Test - Message but got immediate block', () => {
    const gotImmediateBlock: Message[] = [{
      "message": "1Hey, can I have a block?",
      "datetime": "2021-07-17T07:55:00.087Z",
      "author": MessageAuthorEnum.Me
    }];

    const reminder: Reminder = new Reminder(gotImmediateBlock, null, "2021-07-18T08:55:00.087Z");
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(gotImmediateBlock)).toEqual(false);
  });
});