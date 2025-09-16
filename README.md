# GitHub Gist Access API

Next.js serverless API for accessing GitHub Gists with authentication.

## API Endpoints

### POST `/api/gist/exists`
Check if a gist exists:
```json
{
  "gistUri": "https://gist.github.com/username/gist-id"
}
```

### POST `/api/gist/load`
Load gist files and description:
```json
{
  "gistUri": "https://gist.github.com/username/gist-id"
}
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set GitHub token:
- Create a GitHub personal access token with `gist` scope
- Add it to Vercel:
```bash
vercel env add GITHUB_TOKEN
```

3. Run development server:
```bash
vercel dev
```

## CORS Support
- `https://stan-playground.flatironinstitute.org`
- `http://localhost:*` and `https://localhost:*`
- `http://127.0.0.1:*` and `https://127.0.0.1:*`

## Error Codes
- `400`: Bad request
- `403`: Access forbidden
- `404`: Gist not found
- `500`: Server error

## License
MIT
