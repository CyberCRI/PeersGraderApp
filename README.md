## PeersGrader

### Install
1. Copy `_env` into `.env`, add a working email and password. `/!\ DO NOT COMMIT THIS FILE.
`
2. On Ubuntu, in several distinct shells,  :
```shell
npm install                           # Install dependencies
npm run-script mongo                  # Run mongo
npm run-script build && npm run dev   # Build
npm run-script serverjs               # Run website
chromium-browser "http://localhost:5000/#/"   # Opens landing page
```

### Dependencies
- `node`, `npm`
- `mongodb`

### Routes

| Route `./#/{...}`                   | Verb   | Pass* | Description
| ----------------------------------- | ------ | --- | --
| /activity                           | GET    | no  | Get activity form to define an activity `{ title, guideline, sessions, participants }`
| /activity                           | POST   | no  | Create an activity with unique id and admin password.
| /activity/:activity_id              | GET    | no  | Reach activity's description.
| /activity/:activity_id              | PUT    | yes | Update a activity with new info  [password.
| /activity/:activity_id              | DELETE | yes | Delete activity
| /activity/:activity_id/participants | GET    | yes | Read participants.
| /activity/:activity_id/participants | PUT    | yes | Update participants.
| /activity/:activity_id/participants | POST   | yes | Create participant.
| /activity/:activity_id/participants | DELETE | yes | Delete participant.
| /activity/:activity_id/planning     | GET    | no  | Get public planing with students IDs.
| /activity/:activity_id/rubric       | GET    | no  | Get public rubrics form/display.
| /activity/:activity_id/rubric       | POST   | yes | Post rubric.
| /activity/:activity_id/rubric       | PUT    | yes | Update rubric.
| /activity/:activity_id/review       | GET    | no  | Get activity form to fill.
| /activity/:activity_id/review       | POST   | no  | Post reviews.
| /activity/:activity_id/admin        | GET    | yes | Get secret admin dashboard.

### Visual workflow
<img src="https://i.stack.imgur.com/ZMsJb.png" width="500" float="center">
<img src="https://i.stack.imgur.com/dIToA.png" width="500" float="center">
<!--
[1]: https://i.stack.imgur.com/T4DSE.png
[1]: https://i.stack.imgur.com/ZMsJb.png
[2]: https://i.stack.imgur.com/dIToA.png -->

### Database models

### Contacts
Report issues or ideas [on github](/issues).

### Authorship
* [Hugo Lopez](http://twitter.com/hugo_lz) —— project design, earlier prototyping using HTML/CSS/JS & Google forms.
* [Stéphane Jabol]() —— skillful realisation using MongoDB, NodeJS, VueJS, etc.

### Licenses
- Source codes under [MIT License](./LICENSE)
- Contents under CC-by-sa-4.0
