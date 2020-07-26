### Under Development

This bot is still under development. All commands work as intended, and all the commands shown with this readme will be updated with explanations later. A little more quality checking is to be done before I finish this bot, including:

1. Making sure the bot's code is as efficient as I can make it.
2. Line comments and function comments are written so I can understand wtf it does when I come back to it later.
3. Rewrite some variable names to be relevant and easy to understand, and have a consistent pattern across all files.

Future plans: I do hope to implement a backend for this bot, so people can invite this bot onto their servers and use it with the ease of having customizable options right at their fingertips.

This README.md will also be updated to be more thorough.

# ThanksBot

ThanksBot is a simple Javascript Discord bot that stores user-awarded points in a database (specifically Mongoose). The idea is to encourage users to ask and answer questions. With each question answered, other users can choose to thank the user who answered the question by giving them points, leveling them up through roles.

## Summary

  - [Getting Started](#getting-started)
  - [Commands](#commands)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

For personal development purposes, clone this repository to your system, install Node.js, then install the package:

    npm install discord.js
    
Because this is a Discord bot, you to create your Discord application [here](https://discord.com/developers/applications)

run the bot using shell by using the command

    node .

--This section is DEFINITELY not done

### Commands

Can take any number of mentions. The math to divide the points between each user works exponentially (100/(users^0.5)). The person who uses this command gets placed on a 2 minute cooldown before they can use it again. If the user tries to thank themselves, they will receive a random cheesy response back.

    -thanks @user
    -thank @user
    -thanks @user1 @user2 @user3
    -thank @user1 @user2 @user3

Displays the number of points a user has, and how many they need to reach the next rank. Also mentions the next rank role in an embedded message because embeds dont notify users.

    -points
    -points @user

Ranks up the user if they reach a certain threshold. Otherwise, show how many more points needed

    -rankup

Explanation

    -report

Will display all the commands listed here (except -help) and their intended use.

    -help

Explanation

    -about

--This section is not done

## Deployment

I'm self-hosting this bot, so the method of deployment is up to you. Do note: If you plan on using the -rankup command, make sure this bot's role is higher than the roles you are trying to give via rankup.

Since this was a personal project, a lot of my variables will be different from what you would want. I might make a setup module to let others adjust the numbers... but not anytime soon, so you'd just need to download the bot and change them within the code yourself.

--This section is not done

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