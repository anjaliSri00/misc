# Lead Forms Office

This directory contains a multi-step lead form system that collects user information and submits it to a backend API.

## Form Flow

The form follows this sequence:
1. **Landing** - Initial welcome page
2. **Project Type** - Select interior service type
3. **Area Size** - Property size selection
4. **Budget** - Budget range selection
5. **Hiring Likelihood** - Timeline for hiring decision
6. **Location** - City selection
7. **Request Details** - Additional project details
8. **Online Design** - Design service preferences
9. **Other Services** - Additional services needed
10. **Match Confirmation** - Confirm preferences
11. **Email** - Email address collection
12. **Phone** - Phone number collection
13. **Name** - Final submission with marketing opt-in

## API Integration

### Endpoint
- **URL**: `POST /api/leads/form`
- **Base URL**: `http://localhost:3000`

### Request Body
```json
{
  "interior_service": "office|retail|F & B|other",
  "type_of_project": "new property|renovation property|other",
  "property_size": "string",
  "budget": "string",
  "hiring_decision": "string",
  "city": "string",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "marketingOptIn": "boolean"
}
```

### Response
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "number",
    "interior_service": "string",
    "type_of_project": "string",
    "property_size": "string",
    "budget": "string",
    "hiring_decision": "string",
    "city": "string",
    "name": "string",
    "email": "string",
    "mobile": "string",
    "marketing_optin": "boolean",
    "created_at": "date",
    "updated_at": "date"
  }
}
```

## Data Storage

Form data is temporarily stored in `localStorage` during the multi-step process:
- `completeMatchConfirmationData`
- `completeEmailFormData`
- `completePhoneFormData`
- `completeNameFormData`

Data is cleared after successful submission.

## Testing

Use `test-api.html` to test the API endpoint directly. This file provides a form that submits to the backend API and displays the response.

## Backend Requirements

The backend must be running on port 3000 with:
- PostgreSQL database with `lead_data` table
- CORS enabled for cross-origin requests
- Validation middleware for request data
- Lead creation service

## Database Schema

The `lead_data` table should have these columns:
- `id` (primary key)
- `interior_service`
- `type_of_project`
- `property_size`
- `budget`
- `hiring_decision`
- `city`
- `name`
- `email`
- `mobile`
- `marketing_optin`
- `created_at`
- `updated_at`

## Error Handling

The form includes:
- Input validation
- API error handling
- Loading states during submission
- User-friendly error messages
- Fallback redirects on errors
