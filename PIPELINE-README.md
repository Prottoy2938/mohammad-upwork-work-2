# Ideal Plan/Workflow

when the `firebase deploy --only hosting` is run, another command will run `node ./choose-env-file.js`, which will then check the `git branch` (main or development) & based on the git branch, it'll update the `.env` file. Once the execution is complete, it'll continue with the firebase deployment command with the chosen .env file.
