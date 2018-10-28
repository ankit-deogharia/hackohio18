const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');

const FULL_PROMPT = 'showPrompt';

class ShowAssignment extends ComponentDialog {
    constructor(dialogId, userProfileAccessor) {
        super(dialogId);
        if (!dialogId) throw ('Missing parameter.  dialogId is required');
        if (!userProfileAccessor) throw ('Missing parameter.  userProfileAccessor is required');

        this.userProfileAccessor = userProfileAccessor;

        this.addDialog(new WaterfallDialog(FULL_PROMPT, [
          this.listAssignments.bind(this)
        ]));
    }

    async listAssignments(step) {
      let userProfile = await this.userProfileAccessor.get(step.context);
      if (userProfile === undefined || !userProfile.assignmentList) {
        await step.context.sendActivity('Looks like you haven\'t created any assignments yet!');
        return await step.endDialog();
      } else {
        let output = '';
        for (var key in userProfile.dueDates) {
            output += '\n' + key + ' due on ' + userProfile.dueDates[key];
        }
        await step.context.sendActivity('Here is a list of the things you have due by priority: ' + output);
        return await step.endDialog();
      }
    }
}

exports.ShowAssignment = ShowAssignment;
