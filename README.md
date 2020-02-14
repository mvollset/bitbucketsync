
# Bitsyncbucket


This is a commandline utility for syncing bitbucket repos to local filesystem. For the moment it takes all your repos and downloads them. Then it will sync eny future changes.
The utility requires that git and node, is installed on your system.

# Get started

Download repository, run npm install. Then get an app password from bitbucket from here https://bitbucket.org/account/user/<your username>/app-passwords . Copy the config.sample.js to config.js and edit it with your username and password.
Create the folder where you want to put your repositories. Then run the script with node sync.js All your repositories should be downloaded, currently only the master branch. When you run the command again it will only download any updates. 

