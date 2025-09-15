# GitHub Gist Access API

A Next.js serverless API for accessing GitHub Gists with authentication to avoid rate limits. This application provides two endpoints for checking gist existence and loading gist files.

## Features

- **Rate Limit Bypass**: Uses GitHub personal access token for authenticated requests
- **CORS Support**: Configured for `https://stan-playground.flatironinstitute.org` and localhost development
- **TypeScript**: Full type safety throughout the application
- **Vercel Ready**: Optimized for serverless deployment

## API Endpoints

### POST `/api/gist/exists`

Checks if a GitHub Gist exists.

**Request Body:**
```json
{
  "gistUri": "https://gist.github.com/username/gist-id"
}
```

**Response:**
```json
{
  "exists": true
}
```

### POST `/api/gist/load`

Loads files and description from a GitHub Gist.

**Request Body:**
```json
{
  "gistUri": "https://gist.github.com/username/gist-id"
}
```

**Response:**
```json
{
  "files": {
    "filename.js": "file content here",
    "another-file.md": "more content"
  },
  "description": "Gist description"
}
```

## Setup

### Prerequisites

- Node.js 18+ 
- Vercel CLI (`npm i -g vercel`)
- GitHub Personal Access Token

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with the following scopes:
   - `gist` (for accessing gists)
3. Copy the token for use in environment variables

### Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variable in Vercel:
   ```bash
   vercel env add GITHUB_TOKEN
   ```
   Enter your GitHub personal access token when prompted.

4. Start development server:
   ```bash
   vercel dev
   ```

The API will be available at `http://localhost:3000/api/gist/`

### Deployment

Deploy to production:
```bash
vercel --prod
```

Make sure the `GITHUB_TOKEN` environment variable is set in your Vercel project settings.

## CORS Configuration

The API is configured to accept requests from:
- `https://stan-playground.flatironinstitute.org`
- `http://localhost:*` (any port for development)
- `https://localhost:*` (any port for HTTPS development)

## Error Handling

The API provides detailed error responses:

- `400`: Bad request (missing or invalid gistUri)
- `403`: Access forbidden (private gist or insufficient permissions)
- `404`: Gist not found
- `500`: Server error (missing token or internal error)

## Usage Example

```javascript
// Check if gist exists
const existsResponse = await fetch('/api/gist/exists', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gistUri: 'https://gist.github.com/username/gist-id'
  })
});
const { exists } = await existsResponse.json();

// Load gist files
const loadResponse = await fetch('/api/gist/load', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gistUri: 'https://gist.github.com/username/gist-id'
  })
});
const { files, description } = await loadResponse.json();
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token with gist scope | Yes |

## License

MIT
