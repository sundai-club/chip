# React Frontends

## Setup

- `cd` into the directory and run `npm install`

- Make sure you have Docker installed

- You will need to **get an authorization token**.
  - Go to authorization tokens in Admin and find the one associated with your user (Gabe already sent this to you so you don't need to do this step).
  
  - Create/open a file called .env.development in the root of the Github repository (this
  
  - should be a hidden file).
  
  - Set the contents of the file to:
      ```
      VITE_DEV_AUTH_TOKEN=your_token_here
      ```
  
  - Run `npm run dev` to start the Vite development server
  
  - Now when you go to `http://localhost:3000` you should be able to see the app. IGNORE the instruction to go to localhost at the other port - this version of the website will not work properly.  Use port 3000 by going to the link from this step.
  
  - If you go to the settings page you should be able to see details about your user.  Log out will not work (locally).
  

