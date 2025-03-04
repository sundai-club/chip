# Database Schema

## Table: tasks

| Column | Type | Primary Key | Foreign Key | Description |
|--------|------|------------|-------------|-------------|
| id | uuid | ✓ | | Unique identifier for each task |
| title | text | | | Task title |
| description | text | | | Detailed description of the task |
| due_date | date | | | Deadline for task completion |
| pledge_amount | numeric | | | Amount pledged for this task |
| goal_amount | numeric | | | Target fundraising amount |
| status | text | | | Current status of the task |
| category | text | | | Category classification |
| image_url | text | | | URL to task image |
| contributors | int4 | | | Number of contributors |
| created_by | uuid | | → profiles(id) | Reference to user who created the task |
| created_at | timestamptz | | | When the task was created |
| privacy | text | | | Privacy setting for the task |

## Table: profiles

| Column | Type | Primary Key | Foreign Key | Description |
|--------|------|------------|-------------|-------------|
| id | uuid | ✓ | → auth.users.id | Unique identifier for each profile |
| username | text | | | User's chosen display name |
| full_name | text | | | User's full name |
| avatar_url | text | | | URL to profile avatar image |
| created_at | timestamptz | | | When the profile was created |

## Table: pledges

| Column | Type | Primary Key | Foreign Key | Description |
|--------|------|------------|-------------|-------------|
| id | uuid | ✓ | | Unique identifier for each pledge |
| task_id | uuid | | → tasks(id) | Reference to the task |
| user_id | uuid | | → auth.users.id | Reference to the user who made the pledge |
| amount | numeric | | | Pledged amount |
| created_at | timestamptz | | | When the pledge was created |
| updated_at | timestamptz | | | When the pledge was last updated |

## Relationships

- `tasks.created_by` → `profiles.id`: Each task is created by a user from the profiles table
- `pledges.task_id` → `tasks.id`: Each pledge is associated with a specific task
- `pledges.user_id` → `auth.users.id`: Each pledge is made by a user from the auth.users table
- `profiles.id` → `auth.users.id`: Each profile is linked to a user in the auth.users table
