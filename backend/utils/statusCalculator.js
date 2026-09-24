function calculateSubmissionStatus(
    submittedAt,
    deadline
) {

    const submissionTime =
        new Date(submittedAt);

    const deadlineTime =
        new Date(deadline);

    /*
       Exact deadline = On Time
       Before deadline = On Time
       After deadline = Late
    */

    if (submissionTime <= deadlineTime) {
        return "On Time";
    }

    return "Late";
}


function calculateAssignmentStatus(
    deadline,
    submission
) {

    // Student already submitted
    if (submission) {

        return calculateSubmissionStatus(
            submission.submitted_at,
            deadline
        );
    }

    const currentTime = new Date();

    const deadlineTime =
        new Date(deadline);

    /*
       No submission + deadline passed
       = Missing
    */

    if (currentTime > deadlineTime) {
        return "Missing";
    }

    /*
       No submission + deadline not passed
       = Pending
    */

    return "Pending";
}


module.exports = {
    calculateSubmissionStatus,
    calculateAssignmentStatus
};