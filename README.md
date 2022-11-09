## Notes app with authentication

Simple notes app which uses the next technologies:

- Nodejs and Expressjs for the backend
- Handlebars to build templates on the frontend
- MongoDB to store all the data
- Passport to authenticate users

## Getting Started

First, run the development server:

```bash
npm start
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the project by getting into /src folder, here you wll find:
- /config which has the passport configuration.
- /helpers has auth.js to authenticate users.
- /models contains every schema of the database.
- /public every static file like images, css files, etc.
- /routes backend routes.
- /views frontend files which the user will see on the browser.
