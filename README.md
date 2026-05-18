# Watchy Streaming Platform - Simple GitHub Pages Version

This is a simple implementation for the CSE251 bonus task.

## What it includes

- Frontend: HTML, CSS, JavaScript
- Backend logic simulation: JavaScript service layer inside `app.js`
- Database integration: Browser `localStorage`
- User login/register
- Browse/search movies
- Movie details page
- Add to My Vault / watchlist
- Rate movies
- Admin dashboard
- Admin content library: add/delete movies
- Admin user registry: view/toggle user status
- Analytics page

## Why localStorage?

GitHub Pages only hosts static websites. It cannot run Node.js, Express, PHP, Python, or MongoDB server code. Because the assignment requires GitHub Pages only, this version uses localStorage as a simple browser database.

## Login accounts

Admin:
- Email: admin@watchy.com
- Password: admin123

User:
- Email: user@watchy.com
- Password: user123

# Project Description

Watchy is a simple web-based streaming platform prototype developed for the CSE251 Software Engineering project. The system allows users to browse movies and series, search for content, view movie details, add movies to a personal watchlist, and use basic login/register functionality. It also includes an admin area for managing movie content and user accounts.

The project is implemented using three basic parts: frontend, backend logic simulation, and database simulation.

---

## Frontend

The frontend is the visible part of the system that the user interacts with. It was built using:

- HTML
- CSS
- JavaScript

The frontend includes:

- Login page
- Register page
- Home page
- Movie cards
- Movie details page
- My Vault / Watchlist page
- Admin dashboard
- Content library page
- User management page

The design uses a dark theme inspired by modern streaming platforms. The interface allows users to navigate between pages, click buttons, search for movies, and interact with the system easily.

---

## Backend Logic Simulation

Because the project is hosted on GitHub Pages, it cannot use a real backend server such as Node.js, PHP, Java, or Python. GitHub Pages only supports static websites.

For this reason, the backend logic is simulated using JavaScript inside the `app.js` file.

The JavaScript backend logic handles:

- User registration
- User login validation
- Admin login validation
- Searching movies
- Viewing movie details
- Adding movies to the watchlist
- Removing movies from the watchlist
- Adding movies as admin
- Deleting movies as admin
- Changing user account status
- Displaying dashboard statistics

This means that JavaScript works as the controller between the user interface and the stored data.

---

## Database Simulation

Since GitHub Pages does not support real databases such as MongoDB, MySQL, or SQL Server, the project uses browser LocalStorage as a simple database simulation.

LocalStorage is used to save:

- User accounts
- Movie data
- Watchlist data
- Logged-in user session
- Admin changes

This allows the website to remember data even after refreshing the page.

Example data stored in LocalStorage:

users
movies
watchlist
currentUser

Although LocalStorage is not a real production database, it is suitable for this academic prototype because it demonstrates the concept of data storage and database integration in a simple way.


Summary

In summary, Watchy contains:

A frontend built with HTML, CSS, and JavaScript
Backend logic simulated using JavaScript functions
Database integration simulated using browser LocalStorage
GitHub Pages deployment as a static website

This simple structure fulfills the basic implementation requirements of the project while making the website easy to run, test, and deploy.
