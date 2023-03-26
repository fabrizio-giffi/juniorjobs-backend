# Junior Jobs Backend

## Description

Junior Jobs is an online platform designed to connect junior developers with companies that offer entry-level positions in the tech industry. The platform was created with the aim of bridging the gap between talented but inexperienced developers and employers seeking fresh talent.

On Junior Jobs, job seekers can create profiles that showcase their skills, education, and experience. Once their profiles are complete, they can browse through job listings and apply to any that match their skills and interests.
They can also message companies directly to learn more about their job offers or to plan a appointment.

For companies, Junior Jobs provides a streamlined process for finding and hiring junior developers. Employers can post job openings on the platform and browse through profiles of potential candidates. They can also message candidates directly to learn more about their skills and experience.

Overall, Junior Jobs is a valuable resource for both job seekers and employers in the tech industry. It helps to create more opportunities for junior developers and supports their career growth and success.

## Models

- User model
```javascript
{
    firstName: {type: String, default: "N/A", trim: true},
    lastName: {type: String, default: "N/A", trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    passwordHash: {type: String, required: [true, "Password is required."]},
    location: {
        country: {type: String, default: "N/A"},
        city: {type: String,  default: "N/A"}
    },
    profilePic: String,
    bio: {type: String, maxLength: 200, default: "Describe yourself"},
    pronouns: String,
    field: {type: String, enum: ["Frontend", "Backend", "Full-stack", "UX/UI", "Cyber security", "Data analytics"]},
    skills: [String],
    favoriteCompanies: [{type: Schema.Types.ObjectId, ref: "Company" }],
    favoriteJobPosts: [{
        type: Schema.Types.ObjectId,
        ref: "JobPost",
    }],
    calendly: String,
    resetToken: {type: String, default: ""},
    resetTokenExpiry: {type: Date, default: null},
},
{timestamps: true}
```
- Company model

```javascript
{
    name: {type: String, unique: true, required: true, trim: true},
    email: {type: String,required: true,unique: true,trim: true},
    passwordHash: {type: String,required: [true, "Password is required."]},
    address: {
        street: {type: String, default: "N/A"},
        zipCode: {type: String, default: "N/A"},
        city: {type: String, default: "N/A"},
        country: {type: String, default: "N/A"},
    },
    profilePic: String,
    favorites: [{
        type: Schema.Types.ObjectId, ref: "User",
        contacted: {type: Boolean, default: false}
        }],
    jobPosts: [{type: Schema.Types.ObjectId, ref: "JobPost"}],
    resetToken: {type: String, default: ""},
    resetTokenExpiry: {type: Date, default: null},
},
{
    timestamps: true,
}
```
- Jobpost model

```javascript
 {
    title: {type: String, required: true, trim: true},
    description: {
      jobtype: {type: String, enum: ["full time", "part time", "freelance"]},
      heading: String,
      tasks: String,
      requirements: String,
      benefits: String,
    },
    email: {type: String, required: true, trim: true},
    salaryRange: {
      minimum: Number,
      maximum: Number,
    },
    address: {
      city: String,
      country: String,
    },
    company: { type: Schema.Types.ObjectId, ref: "Company"},
    stack: [String],
    field: {type: String, enum: ["Frontend", "Backend", "Full-stack", "UX/UI", "Cyber security", "Data analytics"]},
  },
  {
    timestamps: true,
  }
```

## API Endpoints / Backend Routes

- User auth routes

|HTTP Method | URL                           | Request body    | Succes status | Error status | Description                          |
|------------|-------------------------------|-----------------|---------------|--------------|--------------------------------------|
| POST       | `/auth/user/signup`           | email, password | 201           | 500          | Create user account                  |
| POST       | `/auth/user/login`            | email, password | 200           | 500          | Login for user                       |
| POST       | `/auth/user/forgot-password`  | email           | 200           | 500          | Send mail with url to reset password |
| POST       | `/auth/user/reset-password`   | token, password | 200           | 400          | resets password                      |

- User routes

|HTTP Method | URL                                        | Request body    | Succes status | Error status | Description                          |
|------------|--------------------------------------------|-----------------|---------------|--------------|--------------------------------------|
| GET       | `/api/user/`                                |                 | 200           | 400          | get all users                        |
| GET       | `/api/user/:id`                             |                 | 200           | 400          | get single user                      |
| GET       | `/api/user/publicprofile/:id`               |                 | 200           | 400          | get single user profile              |
| PUT       | `/api/user/edit/:id`                        | firstname, lastname, country, city, calendly, bio, pronouns   |            | 404          |  edit user information |
| PUT       | `/api/user/edit/picture/:id`                | profilePicture  | 200           | 400          | edit picture user                    |
| PUT       | `/api/user/privateprofile/deleteFavJobPost` | id, postId      | 200           | 400          | removes a favorite job post          |
| PUT       | `/api/user/privateprofile/deleteSkill`      | id, skill       | 200           | 400          | removes a skill                      |
| PUT       | `/api/user/privateprofile/deleteFavCompany` | id, companyId   | 200           | 400          | removes a favorite company           |
| PUT       | `/api/user/addJobPost`                      | id, postId      | 200           | 400          | favorite a job post                  |
| PUT       | `/api/user/addCompany`                      | id, companyId   | 200           | 400          | favorite a company                   |
| PUT       | `/api/user/addNewSkill`                     | id, newSkill    | 200           | 400          | add a skill                          |


- Company auth routes

|HTTP Method | URL                                        | Request body    | Succes status | Error status | Description                          |
|------------|--------------------------------------------|-----------------|---------------|--------------|--------------------------------------|
| POST       | `/auth/company/signup`                     | name, email, password| 201      | 500          | create account company               |
| POST       | `/auth/company/login`                      | name, password  | 200           | 500          | login account company                |
| POST       | `/auth/company/forgot-password`            | email           | 200           | 500          | Send mail with url to reset password |
| POST       | `/auth/company/reset-password`             | token, password | 200           | 400          | resets password                      |

- Company routes

|HTTP Method | URL                                        | Request body    | Succes status | Error status | Description                          |
|------------|--------------------------------------------|-----------------|---------------|--------------|--------------------------------------|
| GET       | `/api/company/`                             |                 | 200           | 404          | get all companies                    |
| GET       | `/api/company/:id`                          |                 | 200           | 404          | get one company                      |
| PUT       | `/api/company/edit/:id`                     | name, email, street, zipcode, city, country           | 200           | 500           | edit comapany information |
| PUT       | `/api/company/edit/picture/:id`             | profilePicture  | 200           | 404          | edit company picture                 |
| PUT       | `/api/company/addFavoriteJunior`            | id, juniorId    | 200           | 404          | add favorite junior                  |
| PUT       | `/api/company/delete/favorite`              | id, favoriteId  | 200           | 404          | removes favorite junior              |

- JobPost routes

|HTTP Method | URL                                        | Request body    | Succes status | Error status | Description                          |
|------------|--------------------------------------------|-----------------|---------------|--------------|--------------------------------------|
| GET       | ` /api/posts/`                              |                 | 200           | 404          | get all job posts                    |
| GET       | ` /api/posts/:id`                           |                 | 200           | 404          | get one job post                      |
| PUT       | ` /api/posts/:id`                           | title, description, email, salaryRange, address, company, stack,  |            | 400          | edit job post                |
| PUT       | ` /api/posts/edit/:id`                      | changes         |  200           | 404          | add favorite junior                  |
| POST      | ` /api/posts/`                              | title, description, email, salaryRange, address, company, stack | 201           |   400          | create a job post            |
| DELETE    | ` /api/posts/delete/:id`                    | id              | 200           | 404          | removes favorite junior              |

- Index routes

|HTTP Method | URL                                        | Request body    | Succes status | Error status | Description                          |
|------------|--------------------------------------------|-----------------|---------------|--------------|--------------------------------------|
| GET        | `/`                                        |                 | 200           |              |                                      |
| GET        | `/verify`                                  |                 | 200           |              | verifies user                     |
| POST       | `/send-email`                              |                 | 200           |              | sends an email                       |

## Libraries 

- BcryptJS
- Cookie-parser
- Cors
- Dotenv
- EJS
- Express
- Express-jwt
- Jsonwebtoken
- Mongoose
- Morgan
- Node-email-validation
- Nodemailer

## Links

- Github frontend
    - https://github.com/fabrizio-giffi/juniorjobs-frontend
- Github backend 
    - https://github.com/fabrizio-giffi/juniorjobs-backend
- Deployed version
    - https://juniorjobs-frontend.netlify.app/