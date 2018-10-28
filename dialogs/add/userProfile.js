// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Simple user profile class.
 */
class UserProfile {
    constructor(name) {
        this.name = name || undefined;
        this.assignmentList = [];
        this.dueDates = {};
        this.priority = 0;
    }
};

exports.UserProfile = UserProfile;
