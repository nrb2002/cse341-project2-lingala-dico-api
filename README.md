# Lingala Dico API
This is a bilingual (English-Lingala) dictionary API. It provides words translations from English to Lingala and vice versa, and examples of common usage. 

# Relevance
An English - Lingala dictionary API is very relevant for DR Congo in Africa, and it will be community-driven but moderated.

# The API has 3 types of users:

1. Public users → can search words (read-only)
2. Contributors → can submit new translations
3. Moderators/Admin → approve, reject, edit submissions

# Tech Stack 
# Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- bcrypt (password hashing)

#  Database Design 
1. Users Collection
User {
  _id,
  name,
  email,
  password,
  role: "user" | "moderator" | "admin",
  isActive: true,
  createdAt
}
2. Approved Dictionary Entries from public users' end. 
Word {
  _id,
  sourceLang: "en",
  targetLang: "ln",
  sourceWord: "love",
  targetWord: "bolingo",
  partOfSpeech: "noun",
  examples: [
    {
      source: "I love you",
      target: "Nalingi yo"
    }
  ],
  synonyms: ["bolingo ya motema"],
  createdBy: userId,
  approvedBy: adminId,
  createdAt,
  updatedAt
}


# Key idea:
Never insert user submissions directly into Word.

# API Endpoints 

# Public (No Auth)
GET /api/v1/dictionary/search?word=love
GET /api/v1/dictionary/:id
GET /api/v1/dictionary?limit=20&page=1

# Contributors (Auth Required)
POST /api/v1/submissions
GET  /api/v1/submissions/mine

# Moderation (Admin / Moderator)
GET   /api/v1/submissions/pending
PATCH /api/v1/submissions/:id/approve
PATCH /api/v1/submissions/:id/reject

# Security 

# Authentication
- JWT access token
- Short expiration (15–30 min)
- Refresh tokens later (optional)

# Rate Limiting
Prevent abuse on: search and submissions.

# Example:
5 requests / second / IP

# Validation
Use Joi or express-validator:
- No empty words
- Max length

# Language codes restricted

# Submission Validation Flow 
Yes—open submissions + validation.

# Flow:
- User submits translation
- Stored in submissions
- Moderator reviews

# On approve:
- Copy data → words
- Mark submission as approved

# On reject:
- Keep record (quality control)

# Swagger Documentation
Include:
- GET /words
- POST /words
- PUT /words/{id}
- DELETE /words/{id}

Each with:
- Request body
- Responses
- OAuth security