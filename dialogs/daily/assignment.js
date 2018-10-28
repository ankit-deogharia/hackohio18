// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Simple user profile class.
 */
class Assignment {
    constructor(name, dueDate) {
        this.name = name || undefined;
        this.dueDate = dueDate || undefined;
    }
};

exports.Assignment = Assignment;
