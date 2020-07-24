# ThanksBot

As it turns out, Tatsumaki bot's API has been broken for ages, so now I'm repurposing the bot using MongoDB to be its own role-handling, award giving, thanking bot.

 ~~Discord bot that calls API from Tatsumaki bot to increments points for another user when they answer a question and is thanked for it.

 Explanation: the Eddie van der Meer Discord server (https://discord.gg/jY3BC8j) has a specific channel for questions and answers called #help-feedback. As an incentive for the users to respond to questions posted in #help-feedback, points are given to the user using the Tatsumaki Discord Bot's score system. Upon reaching 100000 score, the user is granted membership privileges, which under normal circumstances can only be obtained through monthly payment.

 This "ThanksBot" does the following (--- is ignored):
 1) Receive infinite arguments with the command:
 ---usage: b!thanks <user> <reason>
 ---example: b!thanks @chendumpling#6818 helping me out
 2) Calls an API from Tatsumaki Discord Bot to increment the thanked user's score by 500 and the thanking user's score by 100
 3) Sends a message in #help-feedback that notifies the thanked user they've been thanked
 4) Logs the increment neatly in #thanks-log which is only accessible by mods for organizing the validity of each thanks.

 Optional functions that may be implemented to this bot:
 1) The bot cannot implement the score of the user that called the thanks bot.
 2) If the usage is wrong, write a message that tells the user the correct usage.
 3) If there are multiple users being thanked, the 500 points is split up between the different users using the following expression:
 ------500/(Math.pow(users, 0.7))
 4) Because this will use the integer variable, every fraction rounds down (ex: 500/(3^0.7) = 231.7 = 231)~~