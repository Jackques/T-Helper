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
    "datetime": "2021-07-10T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "1Reply from match to me",
    "datetime": "2021-07-18T07:55:00.087Z",
    "author": MessageAuthorEnum.Match
  }, {
    "message": "2message from me to match",
    "datetime": "2021-07-19T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }];
  
  const replyOnceNoResponseWithOneReminder: Message[] = [{
    "message": "1Testmessage from me to match",
    "datetime": "2021-07-10T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  },{
    "message": "2Testmessage from me to match - reminder",
    "datetime": "2021-07-14T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "1Reply from match to me",
    "datetime": "2021-07-18T07:55:00.087Z",
    "author": MessageAuthorEnum.Match
  }, {
    "message": "3message from me to match",
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
  }, {
    "message": "4message from me to match",
    "datetime": "2021-07-25T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];
  const replyOnceNoResponseTwoRemindersButBlock: Message[] = [{
    "message": "1Testmessage from me to match",
    "datetime": "2021-07-17T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "2message from me to match",
    "datetime": "2021-07-20T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "1Reply from match to me",
    "datetime": "2021-07-23T07:55:00.087Z",
    "author": MessageAuthorEnum.Match
  }, {
    "message": "3message from me to match",
    "datetime": "2021-07-26T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "4message from me to match",
    "datetime": "2021-07-29T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];

  const replyOnceNoResponseTwoRemindersNoNeedReminderYet: Message[] = [{
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
  }, {
    "message": "4message from me to match",
    "datetime": "2021-12-11T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];
  const replyOnceWithNumberNoRemindersNoNeedReminder: Message[] = [{
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
  }, {
    "message": "4message from me to match",
    "datetime": "2021-12-11T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];
  const replyOnceNoResponseThreeReminders: Message[] = [{
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
  }, {
    "message": "4message from me to match",
    "datetime": "2021-07-25T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }, {
    "message": "5message from me to match",
    "datetime": "2021-07-28T07:55:00.087Z",
    "author": MessageAuthorEnum.Me
  }
  ];

  const currentDateTimeNumber: number = new Date("2021-12-12T07:55:00.087Z").getTime();

  it('Test - opening message no reply', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMe, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(singleOpenerFromMe)).toEqual(true);
  });

  it('Test - opening message with reply', () => {
    const reminder: Reminder = new Reminder(singleOpenerFromMeWithReply, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(singleOpenerFromMeWithReply)).toEqual(false);
  });

  it('Test - reply from match but ghost', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponse, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(replyOnceNoResponse)).toEqual(true);
  });
  it('Test - reply from match with 1 reminder but ghost', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponseWithOneReminder, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(1);
    expect(reminder.getNeedsReminder(replyOnceNoResponseWithOneReminder)).toEqual(true);
  });
  it('Test - reply from match with 1 reminder and block', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponseTwoRemindersButBlock, null, "2021-07-22T08:55:00.087Z", currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(1);
    expect(reminder.getNeedsReminder(replyOnceNoResponseTwoRemindersButBlock)).toEqual(false);
  });

  it('Test - reply from match with 2 reminder but ghost', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponseTwoReminders, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(2);
    expect(reminder.getNeedsReminder(replyOnceNoResponseTwoReminders)).toEqual(true);
  });
  it('Test - reply from match with 2 reminder but no need for reminder yet', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponseTwoRemindersNoNeedReminderYet, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(2);
    expect(reminder.getNeedsReminder(replyOnceNoResponseTwoRemindersNoNeedReminderYet)).toEqual(false);
  });
  it('Test - reply from match with 3 reminder but ghost', () => {
    const reminder: Reminder = new Reminder(replyOnceNoResponseThreeReminders, null, null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(3); // this is the maximum amount of reminders i'm willing to send right?
    expect(reminder.getNeedsReminder(replyOnceNoResponseThreeReminders)).toEqual(false);
  });
  it('Test - reply from match with number and 2 reminder thus no need for reminder yet', () => {
    const reminder: Reminder = new Reminder(replyOnceWithNumberNoRemindersNoNeedReminder, "2021-07-18T08:55:00.087Z", null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(replyOnceWithNumberNoRemindersNoNeedReminder)).toEqual(false);
  });

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

    const reminder: Reminder = new Reminder(gotImmediateNumber, "2021-07-18T08:55:00.087Z", null, currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(gotImmediateNumber)).toEqual(false);
  });
  it('Test - Message but got immediate block', () => {
    const gotImmediateBlock: Message[] = [{
      "message": "1Hey, can I have a block?",
      "datetime": "2021-07-17T07:55:00.087Z",
      "author": MessageAuthorEnum.Me
    }];

    const reminder: Reminder = new Reminder(gotImmediateBlock, null, "2021-07-18T08:55:00.087Z", currentDateTimeNumber);
    expect(reminder.getReminderAmountItems().length).toEqual(0);
    expect(reminder.getNeedsReminder(gotImmediateBlock)).toEqual(false);
  });
});