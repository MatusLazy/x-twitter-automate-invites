# x-twitter-automate-invites
Automate inviting based on usernames to **ALL** the groups you are in

# How to Use
Replace the Usernames Array:
Update the usernames array with the list of Twitter usernames you want to invite to your groups.

# Copy and Paste the Script:
Copy the entire script provided above.

# Run the Script in the Browser Console:
- Login into your X account.
- Navigate to https://x.com/messages/
- Open the browser console (press Ctrl+Shift+I or F12 and navigate to the "Console" tab).
- Paste the copied script into the console.
- Press Enter to run the script.

# Notes
The script includes a 4-second delay between each invite request to avoid triggering rate limits or other restrictions.
Ensure you are logged in to Twitter in the same browser where you are running this script.
If you encounter issues with the provided bearer token, you can replace it with your own.
This scripts only takes in consideration the DOM loaded groups and invites into those. If you want all, edit the script to use Twitter API to fetch all chats or scroll down to load all chats. What will be loaded in DOM will be registered
