# Chat-App (MERN Stack) [(Live link)]()

- Frontend (React + Vite)
- [Backend (Nodejs) ](https://github.com/itz-AmdadulHaque/Chat-App-Backend-)

A simple chat app created using React, tailwind css, socket.io and the backend (api) is created using express js, socket.io and used Mongodb database.

### Features

- <b>Signup and Login (used jwt for authentication)</b><br>
  one can create an account and also can add image(optional) and then can log in and use the app
- <b>Search for user</b><br>
  you can search user and add them to chat and start chating.
- <b>Create and update group</b><br>
  must have at least 3 member including you to create an group chat and must give a name. Only admin can remove or delete the group.

### Future updates

- notification remain after refresh page
- emty search show all user, it will be fix in future
- forgot password and password change
- update user profile name or image
- all message fetch at once which make some delay. only show first page message and when scroll fetch older message

## Env variable

- VITE_BASE_URL

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
