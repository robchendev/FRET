# ThanksBot

ThanksBot is a simple Javascript Discord bot that stores user-awarded points in a database (specifically Mongoose). The idea is to encourage users to ask and answer questions. With each question answered, other users can choose to thank the user who answered the question by giving them points, leveling them up through roles. Moderator-specific commands to change a user's points on-demand are also included. This bot is currently self-hosted and used in the professional musician Eddie van der Meer's [Discord server](https://discord.com/invite/ZXKrfB2).

## Summary

  - [Getting Started](#getting-started)
  - [Commands](#commands)
    - [User Commands](#user-commands)
    - [Moderator Commands](#moderator-commands)
  - [Deployment](#deployment)
  - [Future Plans](#future-plans)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

For personal development purposes, clone this repository to your system, install Node.js, npm, and Discord.js
    
Because this is a Discord bot, you need to create your Discord application [here](https://discord.com/developers/applications)

This bot uses MongoDB to store it's data. The data is stored in the form of a JSON object called a Schema, with it's contents described in models/addPoints.js. You only need to provide a secrets.json (described below) your MongoDB database connection string to use the database, given that you've made one for free already.

This code uses two tokens, "Token" and "Mongo", as described in secrets-example.json. Rename this file secrets.json and edit the following fields:

1. Replace the "Token" value in that file with your bot's token - it is what the bot will use to sign into Discord. 
2. Replace the "Mongo" value with your MongoDB's database connection string. 

If you are to use this code in your public github repositories, do not share your secrets.json file. Doing so will give someone else access to your Discord bot and your database.

Run the bot using shell by using the command

    node .

## Commands

### User Commands

    -thanks <@user>
    -thank <@user>
    -thanks <@user1> <@user2> <@user3>
    -thank <@user1> <@user2> <@user3>

Takes any number of mentions. The math to divide the points between each user works exponentially (100/(users^0.5)). The person who uses this command gets placed on a 5 minute cooldown before they can use it again. The person who uses the command also gets 20% of the points they've awarded. If the user tries to thank themselves, they will receive a random cheesy response back.

    -points
    -points <@user>

Displays the number of points a user has.

    -rankup

Ranks up the user if they have enough points for a role. Otherwise, show how many more points needed. Also repairs the roles if any roles are added by a moderator on accident. Wont show anything if the user isn't recorded in the database.

    -help

Displays all the user commands listed here (except -help) and their intended use.

    -about

Shows information about this bot. Gives a description, the github repository link and the math expression used to calculate how many points are to be awarded to each user being thanked.

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

    +help

Displays all the moderator commands listed here (except -help) and their intended use.

## Deployment

The method of deployment is up to you, I'm personally self-hosting this bot on a VPS.

Do note: If you plan on using the -rankup command, make sure this bot's role is higher than the roles you are trying to give via rankup. I haven't yet made any error checking for this so your bot will just terminate if it encounters this error.

Since this was a personal project, a lot of my variables will be different from what you would want. I might make a setup command or a webpage backend to let others adjust the numbers... but not anytime soon (see [Future Plans](future-plans)), so you'd just need to download the bot and change them within the code yourself.

## Future Plans

I do hope to eventually implement a backend for this bot, so people can invite this bot onto their servers and use it with the ease of having customizable options right at their fingertips. This is a long term goal and not one I'm certain I'll work towards. If you want to tell me your interest in a customizable option for this bot, please contact me via the email shown on [my Github profile](https://github.com/chendumpling99)

## Contributing

Your contributions are very welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug** <br>
If you think you've encountered a bug, please inform me by creating an issue [here](https://github.com/chendumpling99/ThanksBot/issues).

2. **Request a feature** <br>
You can request for a feature by creating an issue [here](https://github.com/chendumpling99/ThanksBot/issues)., and if it is viable, it will be picked for development.

3. **Create a pull request** <br>
If you improved the bot yourself and would like to contribute to this project, I really appreciate it!

> If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

## License

See the [LICENSE](https://github.com/chendumpling99/ThanksBot/blob/master/LICENSE) file for details.

## Authors

  - **Robert Chen** -
    [chendumpling99](https://github.com/chendumpling99)

See also the list of
[contributors](https://github.com/chendumpling99/ThanksBot/contributors)
who participated in this project.