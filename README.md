# Coach Robe Volleyball Training Scheduler

A Next.js application for managing volleyball training session registrations with email confirmations and time-sensitive cancellation links.

## Features

- **Session Management**: Create and manage volleyball training sessions
- **Player Registration**: Simple registration form for training sessions
- **Email Confirmations**: Automatic confirmation emails with session details
- **Time-Sensitive Cancellations**: Secure cancellation links that expire 24 hours before sessions
- **Admin Dashboard**: Manage sessions and view participant information
- **Responsive Design**: Works on desktop and mobile devices

## Email Confirmation System

When a player registers for a session:
1. A confirmation email is automatically sent to the parent's email address
2. The email includes session details and a unique cancellation link
3. The cancellation link expires 24 hours before the training session
4. Players can use the link to cancel their registration securely

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file and update the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Email Configuration (Gmail)
EMAIL_USER="your-gmail-address@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Base URL (update for production)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

#### Setting up Gmail for Email Sending:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use your Gmail address as `EMAIL_USER`
4. Use the generated app password as `EMAIL_PASS`

### 3. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Usage

### For Parents/Players:
1. Browse available sessions at `/sessions`
2. Click "Sign Up" on a session
3. Fill out the registration form
4. Receive confirmation email with cancellation link
5. Use cancellation link if needed (must be used at least 24 hours before session)

### For Coaches/Admins:
1. Access admin panel at `/admin`
2. Create new training sessions
3. View and manage existing sessions
4. View participant information at `/admin/participants`

## API Endpoints

- `POST /api/sessions/:id/registrations` - Register for a session
- `DELETE /api/sessions/:id/registrations` - Cancel registration (manual)
- `GET /api/cancel/:token` - Validate cancellation token
- `DELETE /api/cancel/:token` - Cancel registration via token

## Technical Details

### Database Schema
- **Sessions**: Training session information
- **Registrations**: Player registrations with cancellation tokens
- **Coaches**: Coach information and relationships

### Email Features
- HTML and text email formats
- Responsive email design
- Automatic token generation and expiration
- Secure cancellation links

### Security Features
- Unique cancellation tokens per registration
- Time-based token expiration (24 hours before session)
- Email verification for manual cancellations
- Protected admin routes

## Testing the Email System

1. Update `.env` with valid Gmail credentials
2. Register for a test session
3. Check the registered email address for confirmation
4. Test the cancellation link from the email
5. Verify token expiration by checking registrations close to session time

## Production Deployment

1. Update `NEXT_PUBLIC_BASE_URL` to your production domain
2. Configure production email service (or keep Gmail)
3. Set up proper database (PostgreSQL recommended for production)
4. Deploy to your hosting platform (Vercel, Railway, etc.)

## Troubleshooting

### Email Not Sending
- Verify Gmail credentials and app password
- Check that 2FA is enabled on Gmail account
- Ensure EMAIL_USER and EMAIL_PASS are correct in .env

### Cancellation Links Not Working
- Verify NEXT_PUBLIC_BASE_URL is correct
- Check that tokens haven't expired
- Ensure database has cancellation token fields

### Session Registration Issues
- Verify database is properly migrated
- Check that sessions have available spots
- Ensure all required fields are filled
