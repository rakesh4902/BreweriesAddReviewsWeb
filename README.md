# Bewery Review System

## Overview

The Brewery Review Application is a web-based platform that allows users to search for breweries, view detailed information about them, and leave reviews. The application provides an intuitive interface for users to find breweries by name, city, or type, and offers a robust review system where users can rate and comment on their experiences.

## Interested in Adding a Review?
### Explore breweries and share your experiences on our website. Visit https://breweries-add-reviews-web.vercel.app/ to start adding your reviews today!

## Key Features

1. **User Authentication**:
   - Users can sign up and log in to the application securely.
   - Authentication is handled using JSON Web Tokens (JWT), ensuring user data privacy and security.

2. **Search Functionality**:
   - Users can search for breweries using various criteria: by name, by city, or by type.
   - The search results display relevant breweries matching the user’s query.

3. **Brewery Information**:
   - Detailed information about each brewery is displayed, including name, location, contact information, and website.
   - Users can see a list of reviews left by other users for each brewery.

4. **Review System**:
   - Logged-in users can leave reviews for breweries they have visited.
   - Reviews include a star rating (1 to 5 stars) and a text description of their experience.
   - Users can update or delete their reviews if needed.

5. **Protected Routes**:
   - Certain routes and actions are protected and require user authentication to access.
   - This ensures that only authenticated users can leave, update, or delete reviews.

## Technical Details

### Frontend
- **Framework**: React
  - Functional components and hooks for state management.
  - React Router for client-side routing.
  - CSS for styling components.

### Backend
- **Framework**: Node.js with Express.js
  - RESTful API endpoints for client interactions.
- **Database**: SQLite
  - Stores user data, reviews, and other necessary information.
- **Authentication**: JSON Web Tokens (JWT)
  - Middleware to protect certain routes.

## User Experience

### Home/Search Page
- Users are greeted with a search interface where they can select the search type and enter their query.
- The search results page displays breweries that match the user’s search criteria.

### Brewery Info Page
- Displays detailed information about the selected brewery.
- Users can read reviews left by other users and see average ratings.
- Logged-in users can leave a review or update/delete their existing review.

### User Dashboard
- Users can see a personalized welcome message.
- Users can log out from their account securely.

- ## How to Start This Application on Your Local PC

To start this application on your local PC, follow these step-by-step instructions:

#### 1. Download the Code:
- First, download the zip file containing the application code from the GitHub repository.

#### 2. Unzip the File:
- Unzip the downloaded file to access the application code.

#### 3. Open with VS Code:
- Open the unzipped folder using any code editor, such as Visual Studio Code.

#### 4. Set Up Frontend:
- Open terminal window.
- Navigate to the frontend directory using the command `cd frontend`.
- Install frontend dependencies by running `npm install`.
- Start the frontend server by running `npm start`.
- The frontend application should now be accessible at `http://localhost:3000`.

#### 5. Accessing the Application:
- Since the backend server is running on port 3000 and the frontend server on port 3000, the frontend will be accessible at `http://localhost:3000`.
- To interact with the application, navigate to `http://localhost:3000` in your web browser.
- Tasks can be created within the application.


This setup should allow you to run and interact with the web application seamlessly. If you encounter any issues during the setup process, feel free to reach out for assistance.
