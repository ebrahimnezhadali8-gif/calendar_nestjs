## Calendar Events API
This project is a calendar events management system built with NestJS and TypeORM.
It allows you to add, update, delete, list, search, and find conflicts of events.
The data is stored in PostgreSQL.

## Project setup
Install the project and dependencies:

```bash
$ npm install
```

## run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
## Database
The project uses PostgreSQL. Connection info is in ormconfig.json or in the TypeOrmModule configuration.
## API Endpoints
All requests send data in JSON format.
1. Add Event
- POST /events
- Body: title, description, start, end
2. Update Event
- PUT /events/:id
- Body: title, description, start, end (optional fields can be omitted)
3. Remove Event
- DELETE /events?start=<ISO-date>
4. List Events
- GET /events?range=<day|week|month>&date=<YYYY-MM-DD>||month=<YYYY-MM>
- Params:
- range = day, week, or month
- date = required for day range
- month = required for month range
5. Search Events
- GET /events/search?q=<keyword>
6. Conflicts
- GET /events/conflict?date=<YYYY-MM-DD>
- Shows groups of events that overlap in a given day.
## Notes
- Dates must be in ISO format: YYYY-MM-DD
- All requests and responses use JSON.
- Search is case-insensitive.
- The project is built with NestJS + TypeORM + PostgreSQL.
