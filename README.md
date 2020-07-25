### Under Development

This bot is still under development. Only the thanks command works as intended, and all the commands shown with this readme will be updated with explanations later.

# ThanksBot

ThanksBot is a simple Javascript Discord bot that stores user-awarded points in a database (specifically Mongoose). The idea is to encourage users to ask and answer questions. With each question answered, other users can choose to thank the user who answered the question by giving them points, leveling them up through roles.

## Summary

  - [Getting Started](#getting-started)
  - [Commands](#commands)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Authors](#authors)

## Getting Started

For personal development purposes, clone this repository to your system, and run it using shell by using the command

    node .

### Commands

Can take any number of mentions. The math to divide the points between each user works exponentially (500/(users^0.75)). The person who uses this command gets placed on a 2 minute cooldown before they can use it again. If the user tries to thank themselves, they will receive a random cheesy response back.

    -thanks @user
    -thank @user
    -thanks @user1 @user2 @user3
    -thank @user1 @user2 @user3

Displays the number of points a user has, and how many they need to reach the next rank

    -points
    -points @user

Explanation

    -rankup

Explanation

    -report

Will display all the commands listed here (except -help) and their intended use.

    -help

Explanation

    -about

## Deployment

I'm self-hosting this bot, so the method of deployment is up to you.

Since this was a personal project, a lot of my variables will be different from what you would want. I might make a setup module to let others adjust the numbers so you'd just need to download the bot and change them within the code... but not anytime soon.

## Contributing

Your contributions are very welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug** <br>
If you think you've encountered a bug, please inform me by creating an issue [here](https://github.com/chendumpling99/ThanksBot/issues).

2. **Request a feature** <br>
You can request for a feature by creating an issue [here](https://github.com/chendumpling99/ThanksBot/issues)., and if it is viable, it will be picked for development.

3. **Create a pull request** <br>
If you improved the bot yourself and would like to contribute to this project, I really appreciate it!

> If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

## Authors

  - **Robert Chen** - *Provided README Template* -
    [chendumpling99](https://github.com/chendumpling99)

See also the list of
[contributors](https://github.com/chendumpling99/ThanksBot/contributors)
who participated in this project.