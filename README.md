# InstaClone

A MERN social photo app with JWT authentication, MongoDB persistence, image uploads, likes, saves, comments, follows, profiles, and notifications.

## Run locally

Prerequisites: Node.js 20+, MongoDB running locally or a MongoDB Atlas connection string.

```powershell
cd backend
npm install
npm start
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The API runs on `http://localhost:5000` and the Vite app runs on the URL printed by Vite.

## Configuration

The backend accepts `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`. See [backend/.env.example](backend/.env.example). MongoDB stores users, posts, comments, saves, follows, and notifications. Uploaded images are stored in `backend/uploads` for local development; use object storage such as S3 or Cloudinary for production.

## Main API workflows

- `POST /signUp`, `POST /login`
- `POST /createPost`, `POST /getPosts`
- `POST /toggleLike`, `POST /toggleSave`, `POST /addComment`
- `POST /toggleFollow`, `POST /getUsers`
- `POST /getUserDetails`, `POST /getMyPosts`, `POST /updateProfile`
- `POST /getNotifications`

Authenticated requests may send `Authorization: Bearer <token>`; the legacy body token is still accepted for compatibility with the existing screens.
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
