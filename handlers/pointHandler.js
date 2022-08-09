module.exports = {
  invokingModule: undefined,
  /**
   * Registers the specified module as the invoking module of the handler.
   * @param {Module} module The module to register with the handler.
   */
  register: function (module) {
    this.invokingModule = module;
  },
  /**
   * Creates an entry in the point system for the specified user with a zero score.
   * @param {Schema} pointsModel - the schema that stores point data
   * @param {String} userId - the user this schema should be created for.
   */
  createPointDataForUser: function (pointsModel, userId) {
    const data = new pointsModel({
      userid: userId,
      points: 0,
      wasThanked: 0,
      gaveThanks: 0,
    });
    data.save().catch((error) => console.log(error));
    return data;
  },
  /**
   * Save existing point data.
   * @param {Callback} pointData - the point data callback
   */
  savePointData: function (pointData) {
    pointData.save().catch((error) => console.log(error));
  },
};
