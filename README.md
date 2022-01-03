# F.R.E.T. - Fragile Remains of the Eternal ThankBot

F.R.E.T. is a Javascript Discord bot creates threads for questions, lets users answer those questions, and stores user-awarded points in a MongoDB database. The goal is to encourage an active and organized community help forum similar to StackOverflow but on Discord. Users can ask and answer questions within the FretBot-created threads. With each question answered, other users can choose to thank the user(s) who answered the question by giving them points, leveling them up through roles. Points are also awarded to the user who is thanking to encourage an active discussion. Moderator-specific commands to change data in the database on-demand are also included. This bot is currently self-hosted and used in the a guitar community [discord server](https://discord.com/invite/ZXKrfB2).

## Why the cheesy name?

I couldn't think of anything better.

## Summary

  - [Getting Started](#getting-started)
  - [Demonstration](#demonstration)
  - [Commands](#commands)
    - [User Commands](#user-commands)
    - [Moderator Commands](#moderator-commands)
  - [Weekly Submissions](#weekly-submissions)
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
    
Because this is a Discord bot, you need to create your Discord application [here](https://discord.com/developers/applications)

This bot uses Mongoose JS to store it's data in MongoDB as a JSON schema. You only need to provide a secrets.json (described below) your MongoDB database connection string to use the database, given that you've made one for free already.

This code uses two tokens, "Token" and "Mongo", as described in secrets-example.json. Rename this file secrets.json and edit the following fields:

1. Replace the "Token" value in that file with your bot's token - it is what the bot will use to sign into Discord. 
2. Replace the "Mongo" value with your MongoDB's database connection string. 

If you are to use this code in your public github repositories, do not share your secrets.json file. It will give other people access to your Discord bot and your database. Though, github will likely recognize this and warn you before anyone does.

Run the bot by using the command:

    node .

## Commands

### User Commands

    -q <user question>

Takes a question and creates a thread under the message that invoked the -q command. The thread is auto-archived in 24 hours and can be un-archived by anyone who writes a message in the thread. Automatically handles thread titling.

    -thanks <@user>
    -thank <@user>
    -thanks <@user1> <@user2> <@user3>
    -thank <@user1> <@user2> <@user3>

Takes any number of mentions. The math to divide the points between each user works exponentially (`100/(users^0.5)`). The person who uses this command gets placed on a short cooldown before they can use it again. The person who uses the command also gets 20% of the points they've awarded. Users cannot thank themselves to farm points.

    -points
    -points <@user>

Displays the number of points a user has.

    -rankup

Ranks up the user if they have enough points for a role. Otherwise, show how many more points needed. Also repairs the roles if any roles are added by a moderator on accident. Wont show anything if the user isn't recorded in the database.

    -help

Displays all the user commands listed here (except -help) and their intended use.

    -about

Shows information about this bot. Gives a description, the github repository link and the math expression used to calculate how many points are to be awarded to each user being thanked.

    -w

This is harder to describe, go to [Weekly Submissions](#weekly-submissions) for more information

### Moderator Commands

    +points <@user> inc <points>
    +points <@user> dec <points>
    +points <@user> set <points>

Increases, decreases or sets a user's points by a certain amount.

    +points <@user> pen

Penalizes user for 1000 points.

    +blacklist <@user>
    +blacklist <@user> remove

Adds or removes user from a blacklist. This blacklist is controlled by a role called "help-blacklist" that prevents the user from sending messages in the channel.

    #channel <message>

Only works in the channel whose ID is written in `impersonateChannel` in the `ids.JSON` file. Impersonates yourself as FretBot and remotely sends a message as FretBot into another channel it has access to. FretBot also checks to make sure it has permissions to view and send messages in the channel to avoid errors.

    +help

Displays all the moderator commands listed here (except +help and +imp) and their intended use.

## Weekly Submissions

This is the bulkiest part of the bot, so I'm dedicating a section to it.

### Purpose

### Commands

## Deployment

The method of deployment is up to you, I'm personally self-hosting this bot on a VPS.

Do note: If you plan on using the -rankup command, make sure this bot's role is higher than the roles you are trying to give via rankup. I haven't yet made any error checking for this so your bot will just terminate if it encounters this error.

F.R.E.T. needs the permission to manage messages since it will be deleting messages to clear up the chat whenever someone invokes a command incorrectly or sends a message in the wrong channel.

### Customization

Since this was a personal project, my variables will be different from what you would need. `ids.json` is provided for you to make changes to the identification of roles and channels. Here are what they mean:

    DBmanager - Anyone with this role will be able to use F.R.E.T.'s mod commands
    promoChannel - The channel promo.js to passively runs in
    questionChannel - The channel where question.js can be invoked
    impersonateChannel - The channel that forwards messages to targeted channels
    rank1...6 - The leveled rank names
    rank1Points...6Points - The leveled rank point thresholds

## Future Plans

I will be further improving on FretBot if something on the guitar community server needs to be automated.

## Contributing

Your contributions are very welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug** <br>
If you think you've encountered a bug, please inform me by creating an issue [here](https://github.com/chendumpling/FretBot/issues).

2. **Request a feature** <br>
You can request for a feature by creating an issue [here](https://github.com/chendumpling/FretBot/issues)., and if it is viable, it will be picked for development.

3. **Create a pull request** <br>
If you improved the bot yourself and would like to contribute to this project, I really appreciate it!

> If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

## License

See the [LICENSE](https://github.com/chendumpling/FretBot/blob/master/LICENSE) file for details.

## Authors

  - **Robert Chen** -
    [chendumpling](https://github.com/chendumpling)

See also the list of
[contributors](https://github.com/chendumpling/FretBot/contributors)
who participated in this project.