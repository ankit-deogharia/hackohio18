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
        userProfile.dueDates.sort(function(a, b){
            var keyA = a.priority,
                keyB = b.priority;
            // Compare the 2 dates
            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        }).forEach(function(x) {
            output += '\n' + key + ' due on ' + userProfile.dueDates[key];
        })
        await step.context.sendActivity('Here is a list of the things you have due by priority: ' + output);
        return await step.endDialog();
      }
    }
}

exports.ShowAssignment = ShowAssignment;
