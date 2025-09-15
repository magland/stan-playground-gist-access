# Test Commands for GitHub Gist API

## Test the "exists" endpoint

### Local Development
```bash
curl -X POST http://localhost:3000/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/octocat/6cad326836d38bd3a7ae"}'
```

### Production (Vercel)
```bash
curl -X POST https://stan-playground-gist-access.vercel.app/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/octocat/6cad326836d38bd3a7ae"}'
```

Expected response:
```json
{"exists": true}
```

## Test the "load" endpoint

### Local Development
```bash
curl -X POST http://localhost:3000/api/gist/load \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/octocat/6cad326836d38bd3a7ae"}'
```

### Production (Vercel)
```bash
curl -X POST https://stan-playground-gist-access.vercel.app/api/gist/load \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/octocat/6cad326836d38bd3a7ae"}'
```

Expected response:
```json
{
  "files": {
    "hello_world.rb": "class HelloWorld\n   def initialize(name)\n      @name = name.capitalize\n   end\n   def sayHi\n      puts \"Hello !\"\n   end\nend\n\nhello = HelloWorld.new(\"World\")\nhello.sayHi"
  },
  "description": "Hello World Examples"
}
```

## Test with a non-existent gist

### Local Development
```bash
curl -X POST http://localhost:3000/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/nonexistent/123456789"}'
```

### Production (Vercel)
```bash
curl -X POST https://stan-playground-gist-access.vercel.app/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{"gistUri": "https://gist.github.com/nonexistent/123456789"}'
```

Expected response:
```json
{"exists": false}
```

## Test error handling (missing gistUri)

### Local Development
```bash
curl -X POST http://localhost:3000/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Production (Vercel)
```bash
curl -X POST https://stan-playground-gist-access.vercel.app/api/gist/exists \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response:
```json
{"error": "gistUri is required"}
```

## Test CORS preflight (OPTIONS request)

### Local Development
```bash
curl -X OPTIONS http://localhost:3000/api/gist/exists \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### Production (Vercel) - Test CORS from stan-playground
```bash
curl -X OPTIONS https://stan-playground-gist-access.vercel.app/api/gist/exists \
  -H "Origin: https://stan-playground.flatironinstitute.org" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

This should return CORS headers in the response allowing the stan-playground origin.

## Test from stan-playground domain (simulated)

```bash
curl -X POST https://stan-playground-gist-access.vercel.app/api/gist/exists \
  -H "Content-Type: application/json" \
  -H "Origin: https://stan-playground.flatironinstitute.org" \
  -d '{"gistUri": "https://gist.github.com/octocat/6cad326836d38bd3a7ae"}' \
  -v
```

This simulates a request from the stan-playground domain and should include CORS headers in the response.
