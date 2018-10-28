const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');

const { UserProfile } = require('./userProfile');

// Dialog Id's
const FULL_PROMPT = 'fullPrompt';
const NAME_PROMPT = 'namePrompt';
const ASSIGNMENT_NAME_PROMPT = 'assignmentNamePrompt';
const DUE_DATE_PROMPT = 'dueDatePrompt';
const PROFILE_DIALOG = 'profileDialog';

class AddAssignment extends ComponentDialog {
    constructor(dialogId, userProfileAccessor) {
        super(dialogId);
        if (!dialogId) throw ('Missing parameter.  dialogId is required');
        if (!userProfileAccessor) throw ('Missing parameter.  userProfileAccessor is required');

        this.addDialog(new WaterfallDialog(FULL_PROMPT, [
          this.initializeStateStep.bind(this),
          this.promptForName.bind(this),
          this.promptForAssignment.bind(this),
          this.promptForDueDate.bind(this),
          this.finish.bind(this)
        ]));

        this.addDialog(new TextPrompt(NAME_PROMPT, this.validateName));
        this.addDialog(new TextPrompt(ASSIGNMENT_NAME_PROMPT, this.validateName));
        this.addDialog(new TextPrompt(DUE_DATE_PROMPT, this.validateName));
        this.userProfileAccessor = userProfileAccessor;
    }

    async initializeStateStep(step) {
        let userProfile = await this.userProfileAccessor.get(step.context);
        if (userProfile === undefined) {
            if (step.options && step.options.userProfile) {
                await this.userProfileAccessor.set(step.context, step.options.userProfile);
            } else {
                await this.userProfileAccessor.set(step.context, new UserProfile());
            }
        }
        return await step.next();
    }
    async promptForName(step) {
      const profile = await this.userProfileAccessor.get(step.context);
      if (profile.name === undefined) {
        return await step.prompt(NAME_PROMPT, "Hey there! What's your name?");
      } else {
        return await step.next();
      }
    }
    async promptForAssignment(step) {
      const profile = await this.userProfileAccessor.get(step.context);
      console.log(profile);
      if (profile.name === undefined) {
          let returnedName = step.result;
          profile.name = returnedName;
          await this.userProfileAccessor.set(step.context, profile);
      }
      return await step.prompt(ASSIGNMENT_NAME_PROMPT, 'What is the name of your assignment?');
    }
    async promptForDueDate(step) {
      let assignmentName = step.result;
      this.assignmentName = assignmentName;
      return await step.prompt(DUE_DATE_PROMPT, 'When is it due?')
    }
    async finish(step) {
        const profile = await this.userProfileAccessor.get(step.context);
        console.log(profile);
        let dueDate = step.result;
        profile.assignmentList.push(this.assignmentName);
        profile.dueDates[this.assignmentName] = dueDate;
        step.context.sendActivity('Awesome! I updated your assignment list with: ' + this.assignmentName);
        return await step.endDialog();
    }

    async validateName(validatorContext) {
      const value = (validatorContext.recognized.value || '').trim();
      if (value.length >= 3) {
          return true;
      } else {
          await validatorContext.context.sendActivity(`Input needs to be at least three characters long.`);
          return false;
      }
    }
}

exports.AddAssignment = AddAssignment;
