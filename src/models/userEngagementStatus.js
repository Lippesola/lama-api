exports = userEngagementStatus = {
    type: {
      team: 0,
      teen: 1,
      guest: 2
    },
    status: {
      notRegistered: 0,
      pending: 1,
      rejected: 2,
      registered: 3
    },
    build: {
      auto: 0, // default -> if in first week it is true
      yes: 1,
      no: 1
    },
    cleanup: {
      auto: 0, // default -> if in last week it is true
      yes: 1,
      no: 1
    },
    teens: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    kids: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    prepare1: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    prepare2: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    prepare3: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    training: {
      no: 0,
      propablyNo: 1,
      propablyYes: 2,
      yes: 3,
    },
    driver: {
      no: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
    },
    groupLeader: {
      no: 0,
      yes: 1
    },
    trainer: {
      no: 0,
      yes: 1
    },
    dayLeader: {
      no: 0,
      yes: 1
    },
    dayTeamLeader: {
      no: 0,
      yes: 1
    },
    guitar: {
      no: 0,
      noBeginner: 1,
      yesAdvanced: 2,
      yesMaster: 3
    },
    singing: {
      no: 0,
      yes: 1
    },
    band: {
      no: 0,
      yes: 1
    },
    drama: {
      no: 0,
      sideCharacter: 1,
      mainCharacter: 2
    },
    wish: {
      no: 0,
      yesThird: 1,
      yesSecond: 2,
      yesFirst: 3
    }
  }