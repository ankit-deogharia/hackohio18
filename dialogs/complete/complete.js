const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');

const FULL_PROMPT = 'completePrompt';
const ASSIGNMENT_PROMPT = 'assignmentPrompt';

class CompleteAssignment extends ComponentDialog {
  constructor(dialogId, userProfileAccessor) {
    console.log('constructing');
    super(dialogId);
    if (!dialogId) throw ('Missing parameter.  dialogId is required');
    if (!userProfileAccessor) throw ('Missing parameter.  userProfileAccessor is required');

    this.addDialog(new WaterfallDialog(FULL_PROMPT, [
      this.getAssignmentName.bind(this),
      this.completeAssignment.bind(this)
    ]));
    this.addDialog(new TextPrompt(ASSIGNMENT_PROMPT, (x) => true));
    this.userProfileAccessor = userProfileAccessor;
  }

  async getAssignmentName(step) {
    let userProfile = await this.userProfileAccessor.get(step.context);
    if (userProfile === undefined || !userProfile.assignmentList) {
      await step.context.sendActivity('You don\'t have any assignments!');
      return await step.endDialog();
    } else {
      return await step.prompt(ASSIGNMENT_PROMPT, 'Which assignment have you completed?');
    }
  }
  async completeAssignment(step) {
    let userProfile = await this.userProfileAccessor.get(step.context);
    let toDelete = step.result;
    let newAssignmentList = userProfile.assignmentList.filter(x => x === toDelete);
    if (userProfile.assignmentList.length === newAssignmentList.length) {
      step.context.sendActivity(`Couldn't find an assignment with name ${toDelete}.`);
      return await step.endDialog();
    }
    delete userProfile.dueDates[toDelete];
    await step.context.sendActivity(`Assignment ${toDelete} has been completed!`);
    return await step.endDialog();
  }

}
exports.CompleteAssignment = CompleteAssignment;
