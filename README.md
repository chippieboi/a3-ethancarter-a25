Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Render (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Render (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-FirstnameLastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-FirstnameLastname`.


Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## A3 Car Database Manager

https://a3-ethancarter-a25-1.onrender.com/index

### Brief Description:

The application is meant to serve as an easy-to-use database for users to store information about cars with a silly derived price formula.

The authentication strategy I used was to pass the username and encrypted password to a comparison function, and then if true, let the user to the database page. After that, authentication was handled with JWT tokens.
I implemented it this way because I found a really helpful tutorial that used JWT for authentication and adjusted it to fit into what I wanted the auth function to do.

I used Bootstrap because I had experience with it from my Software Engineering course last year. I made no modifications to it.

Middleware:
express.json() - makes passed data from the front-end JSON format available in req.body
express.static("public") - serves static files from the /public folder

Custom:
authMiddleware(req, res, next) - checks the header for a JWT token, verifies the token, and then attaches user info to req.user. I mainly used this to protect certain tasks like /data, /submit, /modify, and /delete.
Basically any task that would interact with the database, I made sure only logged-in users could interact with.

## Lighthouse Results:
For some reason, running Lighthouse on the render app makes everything crash, so I ran Lighthouse on my local instance of the server and put the numbers here:
<img width="1739" height="243" alt="image" src="https://github.com/user-attachments/assets/3e979263-edbf-41d1-9800-5e382971b2cb" />

<img width="1343" height="297" alt="image" src="https://github.com/user-attachments/assets/47efb57c-c7b0-4684-b37f-165f1100fb31" />


##AI Usage
   For A3, I mainly used Gemini (from Google searches) and ChatGPT for debugging help. I would Google things like "Express server example" and read the Gemini blurb, and go to a website with examples.
   Same deal with MongoDB, though a good chunk of the MongoDB code came from the Atlas setup process. ChatGPT was mainly used for debugging and figuring out some of the syntax errors I made with requests,
   JSON passes, and a general lack of specific knowledge of JS.

## Technical Achievements

### Design/Evaluation Achievements
- **CRAP Principles**:
Which element received the most emphasis (contrast) on each page?

- The buttons received the most contrast on each page. I did this to make sure the users are able to see the clickable options really easily, as they are the most important parts of both my pages. The logout button on the index page is bright red so users can see it easily, and also to make sure they avoid clicking it if they don’t intend to log out. The submit button is easier to see than the view data button because the submission action is more important for users. The view data button is also important, but the submit, modify, and delete actions all show the data for each user after the action completes. Once the user shows the table of their info, the edit and delete buttons clearly distinguish themselves from the dark background in each row of the table.

How did you use proximity to organize the visual information on your page?

- All of the submit and form-related actions for the user are grouped into the light gray box to bunch them all together. The table with the user’s information is below in a clearly defined table for the user to look at. The logout button is really far away from all other button actions, so users don’t accidentally click it, and the submit and view data buttons are about equally useful, so they are next to each other. They also serve similar purposes, hence their proximity. The edit and delete buttons for each entry are next to each other because they serve similar purposes, just like the submit and view data buttons. All of the submission details (mpg, car, year, etc.) are grouped together above the submit button, so the user starts at the top and goes down before clicking the submit button.

What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?

- I used the same font throughout the website because I like it and I think it makes all text feel more unified. The colors of the buttons and backgrounds were mainly selected because of the limitations of Bootstrap. I know I can do custom colors, but the main themes for dark, light, primary, and secondary did just fine for what I wanted. I made sure to use the same colors for each of the entry fields, like username, password on the login screen, and 4 of the 5 entries on the index page. I also really like the lighter gray color for sectioning the page to focus the user on the content. The buttons are also similar across the website. The edit and delete buttons are all the same because of their location in the table, so it looks uniform. The submit, login, and sign up buttons are all the same blue color because I think the color makes them look like the most important buttons on the page.

How did you use alignment to organize information and/or increase contrast for particular elements?

- The table uses alignment to make comparisons easy between data entries. In the form submission, the model, year, and mpg are aligned because they are the most important three fields for each data entry. The fuel type options are vertically aligned with radio buttons to hopefully tell the user that only one can be selected. The color tab is right below it, centered on the form, so the page doesn’t feel lopsided. The title of the page is aligned at the top left to let users know what the purpose of the page is. The submit and view data buttons are aligned horizontally so that they are equally accessible and in the same location for ease of access. Lastly, the log out button is aligned on the right, the only tag to be aligned that way, so it is clearly out of the way of normal user mouse traffic to avoid misclicks.
