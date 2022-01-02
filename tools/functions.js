module.exports = {
    
    /**
     * Deletes message (whether by user or by FretBot) while
     * handling any errors if the message was already deleted.
     * @param {Message} msg - the original command message
     */
    deleteMsg: function (msgToDelete, time) {
        setTimeout(() => 
            msgToDelete.delete().catch(err => {
                console.log('Message was already deleted');
            }), time*1000
        );
    },
    /**
     * Creates addPoints schema for user by adding their score.
     * @param {Schema} pointsAdd - the schema that stores point data
     * @param {String} usersID - a single user's ID
     * @param {Number} score - the amount of points to be added
     */
    createPointdata: function (pointsAdd, usersID, score) {
        const addPoints = new pointsAdd({
            userid: usersID,
            points: score
        })
        addPoints.save().catch(err => console.log(err));
    },
    /**
     * Updates addPoints schema for user by adding their score.
     * @param {Callback} pointdata - the point data callback
     * @param {Number} score - the amount of points to be added
     */
    updatePointdata: function (pointdata, score) {
        pointdata.points = pointdata.points + score;
        pointdata.save().catch(err => console.log(err));
    },
    /**
     * Updates addPoints schema for user by setting their score.
     * @param {Callback} pointdata - the point data callback
     * @param {Number} score - the amount of points to be added
     */
    setPointdata: function (pointdata, score) {
        pointdata.points = score;
        pointdata.save().catch(err => console.log(err));
    },
    /**
     * Creates weeklyUpdate schema for user by adding their score.
     * @param {Schema} updateWeekly - the schema that stores submission data
     * @param {String} usersID - a single user's ID
     * @param {Date} dateToday - the date when this function runs
     */
    createWeeklydata: function (updateWeekly, usersID, dateToday) {
        const weeklyUpdate = new updateWeekly({
            userid: usersID,
            consecutiveSubmissions: 1,
            submissionThisWeek: dateToday,
            submissionLastWeek: undefined,
            submissionLastLastWeek: undefined
        })
        weeklyUpdate.save().catch(err => console.log(err));
    },
    /**
     * Updates weeklyUpdate schema for user by adding their score.
     * @param {Callback} submitdata - the point data callback
     * @param {Number} score - the amount of points to be added
     */
    updateWeeklydata: function (submitdata, dateToday) {
        submitdata.submissionThisWeek = dateToday;
        submitdata.save().catch(err => console.log(err));
    }
};