## Database Schema

### Athletes Table

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `athlete_id` | integer | NOT NULL | `nextval('athletes_athlete_id_seq'::regclass)` |
| `first_name` | varchar(255) | NULL | - |
| `last_name` | varchar(255) | NULL | - |
| `class_year` | varchar(50) | NULL | - |
| `gender` | varchar(10) | NULL | - |
| `fall_sport_id` | integer | NULL | - |
| `winter_sport_id` | integer | NULL | - |
| `spring_sport_id` | integer | NULL | - |

**Primary Key:** `athlete_id`

### Sports Table

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `sport_id` | integer | NOT NULL | `nextval('sports_sport_id_seq'::regclass)` |
| `name` | varchar(255) | NOT NULL | - |
| `season` | varchar(50) | NOT NULL | - |
| `gender` | varchar(10) | NOT NULL | - |

**Primary Key:** `sport_id`

## Relationships

- `athletes.fall_sport_id` → `sports.sport_id`
- `athletes.winter_sport_id` → `sports.sport_id`
- `athletes.spring_sport_id` → `sports.sport_id`

## Run the app here: 
### https://athletic-director-management-app.netlify.app/
