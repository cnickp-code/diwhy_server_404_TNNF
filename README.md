# DIWHY API

![GitHub package.json version](https://img.shields.io/github/package-json/v/thinkful-ei-orka/diwhy_server_404_TNNF?style=plastic)

Programmed by **Carlo Paredes, Magdalena Painter, Jon Oliver, Agatha North, and Victor Jarvis** for Thinkful's Software Engineering Immersion Program.

This program was created using HTML, CSS, Javascript, Node.js, Express, and PostgreSQL.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Live Client Project Link: <https://diwhy-client-404-tnnf.vercel.app/>

DIWHY is a social media platform designed for DIY enthusiasts, hobbyists, and professionals alike to ask for and give advice on projects and other DIY needs.

## API Documentation

---

## POST User

Posts the users data to the database.

**URL**<br />
'/api/user'

**Method**<br />
'POST'

**Data Params (Required)**<br />
Username, email, password

**Success Response**<br />
_Code:_ 201<br />
_Content:_ Username, email, password

**Error Response** <br />
_Code:_ 400<br />
_Content:_ 'Missing field in request body' <br />
_Code:_ 400<br />
_Content:_ 'Password must be longer than 8 characters'<br />
OR 'Password must be less than 72 characters' <br />
OR 'Password must not start or end with empty spaces'<br />
OR 'Password must contain one upper case, lower case, number and special character'<br />
_Code:_ 400<br />
_Content:_ 'Username already taken'
_Code:_ 400<br />
_Content:_ 'Email already taken'

## PATCH User

**URL**<br />
'/api/user'

**Method**<br />
'PATCH'

## GET Categories

Gets all of the different categories from the database.

**URL**<br />
'/api/categories'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Categories

## GET Category By ID

Gets a category from the database by ID for filter/sort purposes.

**URL**<br />
'/category_id'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Category ID and name

**Error Response** <br />
_Code:_ 400<br />
_Content:_ 'Item does not exist.' <br />

## POST Comment

Posts a comment to the database

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ Content, thread ID, and user ID

## GET Thread Comments

**URL**<br />
'/thread/:thread'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ NewComments

## GET Comment

Gets a comment by ID.

**URL**<br />
'/comment_id'

**Method**<br />
'GET'

**Error Response** <br />
_Code:_ 400<br />
_Content:_ 'Comment does not exist.' <br />

## PATCH Comment

Allows the user to edit a comment.

**URL**<br />
'/comment_id'

**Method**<br />
'PATCH'

**Success Response**<br />
_Code:_ 202<br />
_Content:_ Updated content (as updatedComments)

## DELETE Comment

Removes a comment from the database

**URL**<br />
'/comment_id'

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

## POST New Comment Like

**URL**<br />
'/'

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ New Like <br />

## GET Likes By Comment ID

**URL**<br />
'/comment/comment_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Likes <br />

## DELETE Comment Like

**URL**<br />
'/comment/comment_id'

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

## GET Postings

Gets all postings from the database

**URL**<br />
'/api/postings'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Postings (as allPostings)

## GET Posting By ID

**URL**<br />
'/posting_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Posting

**Error Response** <br />
_Code:_ 404<br />
_Content:_ 'Posting does not exist.' <br />

## GET Postings By User

**URL**<br />
'/user/user_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Postings

## GET Postings By Category

**URL**<br />
'category/category_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ Postings

## POST Posting

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ Title, content, user ID, category, accepted app

## PATCH Posting

**URL**<br />
'/posting_id'

**Method**<br />
'PATCH'

**Success Response**<br />
_Code:_ 202<br />
_Content:_ Title, content, accepted app (as updateData)

## DELETE Posting

Removes a posting from the database

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

## GET Threads

Gets threads from the database

**URL**<br />
'/api/threads'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ threads

## GET Threads By ID

Gets filtered threads from the database by ID

**URL**<br />
'/thread_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ newThreads

**Error Response** <br />
_Code:_ 404<br />
_Content:_ 'Thread does not exist' <br />

## GET Threads By Category ID

**URL**<br />
'/category/category_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ newThreads

## GET Threads By User ID

**URL**<br />
'/user/user_id'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 200<br />
_Content:_ newThreads

## POST Thread

Posts a thread to the database

**URL**<br />

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ Title, category, date created, content, user ID

**Error Response** <br />
_Code:_ 404<br />
_Content:_ 'Missing key in request body' <br />

## PATCH Thread

Edits a thread

**URL**<br />
'/thread/thread_id'

**Method**<br />
'PATCH'

**Success Response**<br />
_Code:_ 202<br />
_Content:_ Title, category, date created, content, user ID

## DELETE Thread

Removes a thread from the database

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

## POST Likes

**URL**<br />
'/api/likes/like_id'

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ newLike

## DELETE Likes

**URL**<br />
'/thread/thread_id'

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

## GET User Interests

**URL**<br />
'/api/interests'

**Method**<br />
'GET'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ newInterests

## POST User Interests

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ newInterest

**Error Response** <br />
_Code:_ 400<br />
_Content:_ 'User Interest already exists' <br />

## DELETE User Interest

**URL**<br />
'/id'

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />

**Error Response** <br />
_Code:_ 404<br />
_Content:_ 'User Interest doesn't exist' <br />

## POST Posting Applicant

**Method**<br />
'POST'

**Success Response**<br />
_Code:_ 201<br />
_Content:_ postedApplicant

## DELETE Posting Applicant

**Method**<br />
'DELETE'

**Success Response**<br />
_Code:_ 204<br />
_Content:_ postedApplicant
