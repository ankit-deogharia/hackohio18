const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');

const { UserProfile } = require('./userProfile');

class DailyUpdate extends ComponentDialog {
    constructor(dialogId, userProfileAccessor) {
        super(dialogId);
        if (!dialogId) throw ('Missing parameter.  dialogId is required');
        if (!userProfileAccessor) throw ('Missing parameter.  userProfileAccessor is required');

        
    }
}
