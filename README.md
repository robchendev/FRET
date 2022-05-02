# F.R.E.T. - Fragile Remains of the Eternal ThankBot

[![Contributors][contributors-shield]][contributors-link]
[![Issues][issues-shield]][issues-link]
[![License][license-shield]][license-link]
[![Stars][stars-shield]][stars-link]

F.R.E.T. is a multipurpose Javascript Discord bot whose purpose is to encourage discussion in a discord server by facilitating an organized environment using threads, self-moderating channels and by managing databases to store and retrieve information. F.R.E.T. makes use of Mongoose JS to store and retrieve data from a MongoDB database. The goal is to encourage an active and organized community help forum similar to StackOverflow but on Discord. F.R.E.T. also manages a self-sufficient weekly submission system that grants roles based on the number of weeks in a row a user has participated in. To encourage discussion, users can reward points to each other for helping them on the forum, which can be used to grant roles. Moderator-specific commands to change data in the database on-demand are also included. F.R.E.T. is currently self-hosted and used in a guitar community Discord server [Fingerstyle Central](https://discord.gg/wgyqBZK).

## Contributing

Your contributions are very welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug** <br>
If you think you've encountered a bug, please inform me by creating an issue [here](https://github.com/robchendev/F.R.E.T./issues).

2. **Request a feature** <br>
You can request for a feature by creating an issue [here](https://github.com/robchendev/F.R.E.T./issues).

3. **Create a pull request** <br>
If you improved the bot yourself and would like to contribute to this project, I really appreciate it!

> If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

## Summary

  - [Getting Started](#getting-started)
  - [Demonstration](#demonstration)
  - [Commands](#commands)
    - [Help Commands](#help-commands)
    - [Forum Commands](#forum-commands)
    - [Weekly Submission Commands](#weekly-submission-commands)
    - [Passive Commands](#passive-commands)
    - [Moderator Commands](#moderator-commands)
  - [Deployment](#deployment)
    - [Developer's Configuration](#developers-configuration)
    - [Configuration Handler](#configuration-handler)
    - [Customization](#customization)
    - [Secrets](#secrets)
  - [Future Plans](#future-plans)
  - [Authors](#authors)
  - [License](#license)

## Demonstration
I'm making some gifs and videos that demonstrate this bot's functionality.

## Getting Started
Clone this repository to your system, install Node.js v16.6+, npm, and Discord.js v13.
    
If you plan on using this F.R.E.T.'s code for contributing/testing, or for your own purposes, you need to create your Discord application [here](https://discord.com/developers/applications). Additionally, you can always lean on the [documentation for Discord.js](https://discord.js.org/#/docs/discord.js/stable/general/welcome), or [the guide](https://discordjs.guide/#before-you-begin).

### Run F.R.E.T. Locally
Run F.R.E.T. by using one of the following commands:

    node .
    npm start

## Commands

### Help Commands

    -contribute

Shows links for users to help out with the development of F.R.E.T. by reporting bugs, requesting features and developing code.
    
    -help

Displays all the user commands for the channel it was invoked in (Forum or Weekly Submissions). If it was invoked anywhere else, it displays a list of usable help command variants (f, w, i) that are listed below.

    -help c

Can be called in the Forum or Weekly Submissions channel to display a list of usable help command variants (f, w, i) that are listed below. 

    -help f

Displays all the user commands for the Forum channel.

    -help w

Displays all the user commands for the Weekly Submissions channel.

    -help i

Displays a description of F.R.E.T.'s purpose and links to this GitHub repository.

### Forum Commands

    -q <your question>

Takes a question and creates a thread under the message that invoked the -q command. The thread is auto-archived in 24 hours and can be un-archived by anyone who writes a message in the thread. Automatically handles thread titling.

    -thanks <@user>
    -thank <@user>
    -thanks <@user1> <@user2> <@user3>
    -thank <@user1> <@user2> <@user3>

Takes any number of mentions. The math to divide the points between each user works exponentially (`100/(users^0.5)`). The person who uses this command gets placed on a short cooldown before they can use it again to avoid spam. The person who uses the command also gets 20% of the points they've awarded. Users cannot thank themselves to farm points.

    -rankup

Ranks up the user if they have enough points for a role. Otherwise, show how many more points needed. Also repairs the roles if any roles are added by a moderator on accident. Wont show anything if the user isn't recorded in the database.

    -points
    -points <@user>

Displays the number of points a user has.

    -top
    -leaderboard
    -top <rows>
    -leaderbaord <rows>

Displays a leaderboard of 10 rows by default, showing the users with the most amount of points first. The person who used the command also has their rank placement and points shown at the bottom of the leaderboard underneath a divider. If the user specifies a number for the rows, it will show that many rows. Maximum rows that can be shown, regardless of the rows specified, is the size of the set of users with pointdata documents in the database.

### Weekly Submission Commands

A CronJob task occurs every Sunday 11:59 PM EST to finalize the submissions for a week, creates the data for the users who submitted a weekly for the first time, updates the data of each user with an existing weekly submission history, and assigns temporary or permanent "trophy" roles if the user has submitted enough weeks in a row. If the user has a weekly submission history and a streak but they did not submit for that week, the streaks are reset and temporary roles are removed.

    -w submit <link/file>

Submits a link or attachment for the Weekly Submissions. This logs the user's submitted date in the database which will be used to increase their streak at the weekly finalization. Also creates a thread under the message. The thread is auto-archived in 1 hour and can be un-archived by anyone who writes a message in the thread.

    -w info

Displays the current time in EST, the next weekly finalization time in EST, and shows how many days, hours and minutes remain before the weekly finalization.

    -w profile
    -w profile <@user>

Displays a fancy user profile that shows the user's username, profile picture, temporary roles, permanent "trophy" roles, submission times of this week and last week, current streak and highest streak.

### Passive Commands

These happen automatically without any command being sent in the chat.

    <link>

Only works in the channel whose ID is written in `shareMusicChannel` in the `config.JSON` file. Creates a thread under the message. The purpose of this is to avoid these promotional links from getting buried due to people who talk about the promoted link (usually a video). The thread is auto-archived in 1 hour and can be un-archived by anyone who writes a message in the thread. Automatically handles thread titling. Any message that isnt a link is removed and the user is reminded that discussion is only allowed in the threads.

    <#channel> <message>

Only works in the channel whose ID is written in `impersonateChannel` in the `config.JSON` file. Impersonates yourself as F.R.E.T. and remotely sends a message as F.R.E.T. into another channel it has access to. F.R.E.T. also checks to make sure it has permissions to view and send messages in the channel and will log an error in the `impersonateChannel`.

### Moderator Commands

    +help

Displays all the moderator commands listed here (except +help) and their intended use.

    +points <@user> <amount> [options: set]

Increases, decreases or sets a user's points by a certain amount. The amount can be any valid integer, negative values will decrease the user's score while positive values will increase it. Specifying `set` at the end of the command will set the user's points to the exact amount specified.

    +penalty <@user>

Penalizes user for 1000 points.

    +w inv <@user>
    +w invalidate <@user>

Invalidates a user's weekly submission such that that they haven't submitted this week. Doesn't account for previously submitted valid submissions in the same week, so the user needs to submit again after this command is invoked.

    +w setstreak <@user> <streaks>

Sets a user's weekly submission streak to a specific amount.

    +w reset <@user>

Resets a user's weekly streak and weekly rank.

## Deployment

If you want to use this bot for your own personal use, the method of deployment is up to you. I'm personally self-hosting F.R.E.T. on a VPS.

Do note: Make sure F.R.E.T.'s role is higher than any of the roles you plan to give using F.R.E.T., I haven't yet made any error checking for this so your F.R.E.T. will just terminate if it encounters this error. The hierarchy of F.R.E.T. won't affect your server because it'll only have the permissions you set for it, no matter how high it is on the role hierarchy.

F.R.E.T. needs the permission to manage messages since it will be deleting messages to clear up the chat whenever someone invokes a command incorrectly or sends a message in the wrong channel.

### Developer's Configuration
Under the folder `configurations` you'll notice a file named `flux.prod.json`. This file contains IDs used in Discord for your bot, guild, roles, channels, etc. You may create a `flux.dev.json` file in the same folder by copying `flux.prod.json` to change all of the IDs and test everything in your own server. This is your personal development configuration and it will be ignored. Be careful not to modify the `flux.prod.json` file. Any pull requests modifying it without explicit permission in the focal issue of the PR will be closed without merging.

* **serverGuild**<br>ID of your discord server
* **moderatorRoleId**<br>ID of the moderator role in your server
* **everyoneRoleId**<br>ID of the everyone role in your discord server
* **DBmanager**<br>ID of a role. Anyone with this role will be able to use F.R.E.T.'s mod commands
* **shareMusicChannel**<br>ID of the channel shareYourMusic.js passively runs in
* **helpForumChannel**<br>ID of the channel where forum.js passively runs in can be invoked
* **impersonateChannel**<br>ID of the channel that forwards messages to targeted channels
* **weeklyGuideChannel**<br>ID of the channel where the weekly submission criteria are listed
* **weeklyChannel**<br>ID of the channel for weekly submissions

### Configuration Handler
In the module defined in `commandHandler.js`, you'll notice a property named `isDebug`, this should be set to true for local development, and false when deploying. This determines which flux configuration is loaded at runtime.

### Customization
Since this was a personal project, my variables will be different from what you would need. There are two files you may need to customize for this bot to work on your local machine or server. `config.json` is provided for you to make changes to the prefixes, names, colors and leveled-ranks.

* **userPrefix**<br>The prefix used for user commands
* **moderatorPrefix**<br>The prefix used for moderator commands
* **botName**<br>The name the bot will refer to itself as
* **...Color**<br>The colors of embeds depending on their usage 
* **rank1...6**<br>Leveled forum rank names
* **rank1Points...6Points**<br>Leveled forum rank point thresholds
* **wRank1...3**<br>Temporary weekly submission rank names
* **wRank1Streak...3Streak**<br>Temporary weekly submission rank streak thresholds
* **wRankPerma**<br>Permanent "trophy" weekly submission rank name
* **wRankPermaStreak**<br>Permanent "trophy" weekly submission rank streak threshold

### Secrets
F.R.E.T. uses MongooseJS to store it's data in MongoDB as a JSON schema. You only need to provide a `secrets.json` (described below) your MongoDB database connection string to use the database, given that you've made one for free already. This code uses two tokens, "Token" and "Mongo", as described in `secrets-example.json`. Create a copy of this file and name it `secrets.json`, then, edit the fields:

* **Token**<br>The token your applications bot will be using to sign into Discord.
* **Mongo**<br>The string used to connect to your MongoDB database.

If you are to use this code in your public github repositories, do not share your `secrets.json` file. It will give other people access to your Discord bot and your database. Though, github will likely recognize this and warn you before anyone does.

## Future Plans

I will be further improving on F.R.E.T. if something on the guitar community server needs to be automated.

## License

See the [LICENSE](https://github.com/robchendev/F.R.E.T./blob/master/LICENSE) file for details.

## Author

  - **Robert Chen** -
    [robchendev](https://github.com/robchendev)

## Contributors

  - **Taco (タコス)** -
    [tacosontitan](https://github.com/tacosontitan)

See also the list of
[contributors](https://github.com/robchendev/F.R.E.T./contributors)
who participated in this project.

<!-- Shields, images, and links  -->

[contributors-shield]: https://img.shields.io/github/contributors/robchendev/F.R.E.T.?style=flat
[contributors-link]: https://github.com/robchendev/F.R.E.T./graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/robchendev/F.R.E.T.
[issues-link]: https://github.com/robchendev/F.R.E.T./issues
[license-shield]: https://img.shields.io/github/license/robchendev/F.R.E.T.
[license-link]: https://github.com/robchendev/F.R.E.T./blob/master/LICENSE
[stars-shield]: https://img.shields.io/github/stars/robchendev/F.R.E.T.
[stars-link]: https://github.com/robchendev/F.R.E.T./stargazers
