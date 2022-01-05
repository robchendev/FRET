# F.R.E.T. - Fragile Remains of the Eternal ThankBot

F.R.E.T. is a multipurpose Javascript Discord bot whose purpose is to encourage discussion in a discord server by facilitating an organized environment using threads, self-moderating channels and by managing databases to store and retrieve information. F.R.E.T. makes use of Mongoose JS to store and retrieve data from a MongoDB database. The goal is to encourage an active and organized community help forum similar to StackOverflow but on Discord. F.R.E.T. also manages a self-sufficient weekly submission system that grants roles based on the number of weeks in a row a user has participated in. To encourage discussion, users can reward points to each other for helping them on the forum, which can be used to grant roles. Moderator-specific commands to change data in the database on-demand are also included. F.R.E.T. is currently self-hosted and used in the guitar community Discord server [Fingerstyle Central](https://discord.com/invite/ZXKrfB2).

## Why the cheesy name?

I named it F.R.E.T. first and had to think of what it could be an acronym of.

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
    - [Customization](#customization)
  - [Future Plans](#future-plans)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Demonstration

I'm making some gifs and videos that demonstrate this bot's functionality.

## Getting Started

For personal development purposes, clone this repository to your system, install Node.js v16.6+, npm, and Discord.js v13.
    
Because this is a Discord bot, you need to create your Discord application [here](https://discord.com/developers/applications).

F.R.E.T. uses MongooseJS to store it's data in MongoDB as a JSON schema. You only need to provide a secrets.json (described below) your MongoDB database connection string to use the database, given that you've made one for free already.

This code uses two tokens, "Token" and "Mongo", as described in secrets-example.json. Rename this file secrets.json and edit the fields:

1. Replace the "Token" value in that file with your application's bot token - it is what the F.R.E.T. will use to sign into Discord. 
2. Replace the "Mongo" value with your MongoDB's database connection string. 

If you are to use this code in your public github repositories, do not share your secrets.json file. It will give other people access to your Discord bot and your database. Though, github will likely recognize this and warn you before anyone does.

Run F.R.E.T. by using the command:

    node .

## Commands

### Help Commands

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

    -about

Shows information about F.R.E.T.. Gives a description, the github repository link and the math expression used to calculate how many points are to be awarded to each user being thanked.

### Weekly Submission Commands

A CronJob task occurs every Sunday 11:59 PM EST to finalize the submissions for a week, creates the data for the users who submitted a weekly for the first time, updates the data of each user with an existing weekly submission history, and assigns temporary or permanent "trophy" roles if the user has submitted enough weeks in a row. If the user has a weekly submission history and a streak but they did not submit for that week, the streaks are reset and temporary roles are removed.

    -w submit <link/file>

Submits a link or attachment for the Weekly Submissions. This logs the user's submitted date in the database which will be used to increase their streak at the weekly finalization.

    -w info

Displays the current time in EST, the next weekly finalization time in EST, and shows how many days, hours and minutes remain before the weekly finalization.

    -w profile
    -w profile <@user>

Displays a fancy user profile that shows the user's username, profile picture, temporary roles, permanent "trophy" roles, submission times of this week and last week, current streak and highest streak.

### Passive Commands

These happen automatically without any command being sent in the chat.

    <link>

Only works in the channel whose ID is written in `promotionChannel` in the `ids.JSON` file. Creates a thread under the message. The purpose of this is to avoid these promotional links from getting buried due to people who talk about the promoted link (usually a video). The thread is auto-archived in 24 hours and can be un-archived by anyone who writes a message in the thread. Automatically handles thread titling. Any message that isnt a link is removed and the user is reminded that discussion is only allowed in the threads.

    <#channel> <message>

Only works in the channel whose ID is written in `impersonateChannel` in the `ids.JSON` file. Impersonates yourself as F.R.E.T. and remotely sends a message as F.R.E.T. into another channel it has access to. F.R.E.T. also checks to make sure it has permissions to view and send messages in the channel and will log an error in the `impersonateChannel`.

### Moderator Commands

    +points <@user> inc <points>
    +points <@user> dec <points>
    +points <@user> set <points>

Increases, decreases or sets a user's points by a certain amount.

    +points <@user> pen

Penalizes user for 1000 points.

    +help

Displays all the moderator commands listed here (except +help and +imp) and their intended use.

    +w reset

Resets a user's weekly streak and weekly rank.

## Deployment

The method of deployment is up to you, I'm personally self-hosting F.R.E.T. on a VPS.

Do note: Make sure F.R.E.T.'s role is higher than any of the roles you plan to give using F.R.E.T., I haven't yet made any error checking for this so your F.R.E.T. will just terminate if it encounters this error. The hierarchy of F.R.E.T. won't affect your server because it'll only have the permissions you set for it, no matter how high it is on the role hierarchy.

F.R.E.T. needs the permission to manage messages since it will be deleting messages to clear up the chat whenever someone invokes a command incorrectly or sends a message in the wrong channel.

### Customization

Since this was a personal project, my variables will be different from what you would need. `ids.json` is provided for you to make changes to the identification of roles and channels. Here are what they mean:

    botName - The name the bot will refer to itself as
    DBmanager - ID of a role. Anyone with this role will be able to use F.R.E.T.'s mod commands
    serverGuild - ID of your discord server
    promoChannel - ID of the channel promo.js passively runs in
    helpForumChannel - ID of the channel where forum.js passively runs in can be invoked
    impersonateChannel - ID of the channel that forwards messages to targeted channels
    weeklyChannel - ID of the channel for weekly submissions
    ...Color - The colors of embeds depending on their usage 
    rank1...6 - Leveled forum rank names
    rank1Points...6Points - Leveled forum rank point thresholds
    wRank1...3 - Temporary weekly submission rank names
    wRank1Streak...3Streak - Temporary weekly submission rank streak thresholds
    wRankPerma - Permanent "trophy" weekly submission rank name
    wRankPermaStreak - Permanent "trophy" weekly submission rank streak threshold

## Future Plans

I will be further improving on F.R.E.T. if something on the guitar community server needs to be automated.

## Contributing

Your contributions are very welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug** <br>
If you think you've encountered a bug, please inform me by creating an issue [here](https://github.com/chendumpling/F.R.E.T./issues).

2. **Request a feature** <br>
You can request for a feature by creating an issue [here](https://github.com/chendumpling/F.R.E.T./issues)., and if it is viable, it will be picked for development.

3. **Create a pull request** <br>
If you improved the bot yourself and would like to contribute to this project, I really appreciate it!

> If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

## License

See the [LICENSE](https://github.com/chendumpling/F.R.E.T./blob/master/LICENSE) file for details.

## Authors

  - **Robert Chen** -
    [chendumpling](https://github.com/chendumpling)

See also the list of
[contributors](https://github.com/chendumpling/F.R.E.T./contributors)
who participated in this project.