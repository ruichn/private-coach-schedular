# Security Implementation Guide

This document outlines the security measures implemented in the Private Coach Scheduler application and provides guidance for maintaining security.

## 🔐 Security Features Implemented

### 1. Environment Security
- **Secure Environment Variables**: Sensitive data moved to secure configuration
- **Environment Template**: `.env.example` file provided with secure defaults
- **Credential Management**: Database URLs, API keys, and passwords properly secured

### 2. Authentication & Authorization
- **Bcrypt Password Hashing**: Admin passwords hashed with bcrypt (12 salt rounds)
- **JWT Session Management**: Secure token-based authentication for admin sessions
- **HTTP-Only Cookies**: Session tokens stored in secure, HTTP-only cookies
- **Session Timeout**: Configurable session expiration (default: 1 hour)

### 3. Input Validation
- **Zod Schema Validation**: All API endpoints validate input using Zod schemas
- **XSS Prevention**: Input sanitization and validation prevents malicious input
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Data Type Enforcement**: Strict typing and validation on all user inputs

### 4. Rate Limiting
- **Brute Force Protection**: Login attempts limited (5 attempts per 15 minutes)
- **IP-Based Limiting**: Rate limiting based on client IP addresses
- **Configurable Limits**: Rate limits can be adjusted via environment variables

### 5. Privacy Protection
- **PII Sanitization**: Personal information removed from application logs
- **Data Minimization**: Only necessary data is logged and stored
- **Secure Logging**: Error logs sanitized to prevent data leakage

### 6. CSRF Protection
- **Token-Based CSRF Protection**: All state-changing requests require CSRF tokens
- **SameSite Cookies**: Cookie security attributes prevent CSRF attacks
- **Header Validation**: CSRF tokens validated via custom headers

## 🚀 Setup Instructions

### 1. Generate Admin Password Hash
```bash
node scripts/generate-admin-hash.js
```

### 2. Update Environment Variables
Copy `.env.example` to `.env` and update with secure values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Secure database connection string
- `EMAIL_USER` & `EMAIL_PASS`: Email service credentials
- `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password
- `JWT_SECRET`: Secure random string (minimum 32 characters)
- `NEXT_PUBLIC_BASE_URL`: Application base URL

### 3. Install Security Dependencies
Security packages are automatically installed:
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT token management
- `zod`: Input validation
- `@types/bcrypt` & `@types/jsonwebtoken`: TypeScript support

## 🛡️ Security Best Practices

### For Developers

1. **Never Log Sensitive Data**
   ```typescript
   // ❌ Bad
   console.log('User data:', { email, password, phone })
   
   // ✅ Good
   console.log('User data:', sanitizeLogData({ email, password, phone }))
   ```

2. **Always Validate Input**
   ```typescript
   // ❌ Bad
   const { email } = await request.json()
   
   // ✅ Good
   const validation = validateRequest(emailSchema, await request.json())
   if (!validation.success) return error
   ```

3. **Protect Admin Routes**
   ```typescript
   // ❌ Bad
   export async function POST(request: Request) {
   
   // ✅ Good
   export async function POST(request: NextRequest) {
     const authError = requireAdminAuth(request)
     if (authError) return authError
   ```

### For Deployment

1. **Environment Security**
   - Use secure secret management (AWS Secrets Manager, Azure Key Vault)
   - Rotate secrets regularly
   - Never commit secrets to version control

2. **HTTPS Enforcement**
   - Always use HTTPS in production
   - Set secure cookie flags
   - Implement HSTS headers

3. **Database Security**
   - Use connection pooling
   - Enable database audit logging
   - Regular security updates

## 🔍 Security Monitoring

### Key Metrics to Monitor
- Failed login attempts
- Rate limiting triggers
- Authentication failures
- Unusual registration patterns
- Database connection errors

### Log Analysis
The application logs security events with sanitized data:
```
Admin login successful from IP: [IP_ADDRESS]
Rate limit exceeded for admin login from IP: [IP_ADDRESS]
Failed admin login attempt from IP: [IP_ADDRESS]
```

## 🚨 Incident Response

### Security Breach Response
1. **Immediate Actions**
   - Revoke all admin sessions
   - Change admin password hash
   - Rotate JWT secret
   - Review access logs

2. **Investigation**
   - Check application logs
   - Verify database integrity
   - Identify affected data

3. **Recovery**
   - Update security configurations
   - Notify affected users if required
   - Document lessons learned

## 📋 Security Checklist

### Pre-Deployment
- [ ] Environment variables secured
- [ ] Admin password hash generated
- [ ] JWT secret configured (32+ characters)
- [ ] Database credentials secured
- [ ] Email credentials secured
- [ ] HTTPS configured
- [ ] Security headers enabled

### Regular Maintenance
- [ ] Monitor failed login attempts
- [ ] Review application logs
- [ ] Update dependencies
- [ ] Rotate secrets quarterly
- [ ] Security audit annually

## 🆘 Support

For security concerns or to report vulnerabilities:
1. Do not create public GitHub issues for security problems
2. Contact the development team directly
3. Provide detailed information about the issue
4. Allow time for investigation and fix before disclosure

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Guidelines](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/production-checklist)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Zod Validation](https://zod.dev/)

---

**Last Updated**: January 2025
**Security Audit Required**: Annually