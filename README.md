# ULV for Visual Studio Code

ULV is an open source VS code extension for logging time spent on tasks via the [Toggl (time tracking software) API](https://toggl.com/). [*And a little something extra*](#evil-mode)

## Features

![Menu](static/img/ulv_menu.png)

### Start a timer
1. Press `F1` or `CTRL + Shift + P` (or `⌘ + Shift + P` on macOS)
2. Type `ulv`
3. Select the option `ulv: Start time entry`
4. Specify a description of the task you're starting

![Start timer](static/img/ulv_menu_start.png)

### Stop the current timer
1. Press `F1` or `CTRL + Shift + P` (or `⌘ + Shift + P` on macOS)
2. Type `ulv`
3. Select the option `ulv: Stop time entry`
4. If a timer is running, it will be stopped

### See status
See the status bar on the bottom left-hand side of the VS Code window.
- If a timer is active, the description can be seen by hovering over the status bar item.
- To open Toggl.com in your browser, click the status bar item.
#### No active timer
![Status bar: No active timer](static/img/ulv_status_none.png)

#### Active timer
![Status bar: Active timer](static/img/ulv_status_running.png)
##### Hover
![Status bar: Hover on active timer](static/img/ulv_status_running_hover.png)

### Set the Toggl API key
The Toggl API key is stored in VS Code's secrets storage. If you wish to update/replace the current API key, you can do so by:
1. Press `F1` or `CTRL + Shift + P` (or `⌘ + Shift + P` on macOS)
2. Type `ulv`
3. Select the option `ulv: Set Toggl API key`

![Set API key](static/img/ulv_menu_set_api_key.png)

## Extension Settings
This extension contributes the following settings:

* `ulv.apiKey`: The API key for Toggl - stored in the VS code secrets storage.
* `ulv.evilMode`: Whether `ulv` should be run in evil mode. See more details below.

## Evil mode
This repository was purposefully made to demonstrate that you shouldn't necessarily trust open source projects. I've taken a few steps with this repository to make it look like a trustworthy piece of software. By following good development practices (documentation, linting, conventional commits, and more), providing proper descriptions of the project (description field, tags, README), and forging the commit history to make it look like a long-running project (initial commit was actually ~March 20th 2023, but according to Git it's Jan 2 2021.), I've made the project look more trustworthy which will hopefully reduce your level of skepticism when considering if you should use the software. There's a number of other measures one can take as well, such as purchasing *stars* and *forks* for the repository, generating fake traffic (issues, discussions, etc.), assigning commits in the commit history to other users to make it look like there's more collaborators involved - the list goes on.

This extension is actually evil. A wolf (ulv) in sheep's clothing. Upon launching the extension, you'll be asked whether the `ulv` shall be evil. By selecting the affirmative answer ('YES! Please steal my secrets!'), the extension will enable its `definitelyNotEvilMode`, which uses the `triggerStateChange()` function in [utils.ts](./src/utils.ts) to acquire various pieces of information from your machine. This is triggered on a schedule, alongside the task of updating the status bar displaying the tracked time from Toggl.

The most sensitive pieces of data that's acquired, are the contents of your clipboard and the contents of the SSH key file (though only the public key, for the purpose of this demo).

Other data that the `ulv` will exfiltrate includes
- System information, such as the OS, user IDs, group memberships, and architecture.
- Node runtime, such as the version, and which features are enabled
- Unique identifiers, both for your device (machineId) and for your current session (sessionId)

We could also gather further information on the software installed on the device, such as VS Code extensions, and OS software packages and their versions, to identify potential vulnerable software for further exploitation.

Again, for the purpose of this demo, the data gathered is not sent anywhere - it is only gathered and saved to a JSON file on disk. There is, however, nothing in the way of e.g. encrypting these data, and sending them to my server.

Of course, there are far worse things that I could make the extension do as well - with the ability to write files to disk, and access any file as the logged in user, we could do anything from ransomware deployment (also known as an [*encryption event*](https://twitter.com/vxunderground/status/1633125378347728896)) to executing any command we wish to. 

## Disclaimer
This project is in no way affiliated with Toggl.

Any and all software and information in this repository is for educational purposes only. It should not be used for illegal activity. The author is not responsible for its use.
