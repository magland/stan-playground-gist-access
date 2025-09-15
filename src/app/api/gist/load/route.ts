import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// CORS configuration
const allowedOrigins = [
  'https://stan-playground.flatironinstitute.org',
  'http://localhost:3000',
  'https://localhost:3000',
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/localhost:\d+$/,
];

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && allowedOrigins.some(allowed => 
    typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Check for GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { 
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { gistUri } = body;

    if (!gistUri) {
      return NextResponse.json(
        { error: 'gistUri is required' },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Extract gist ID from URI
    const parts = gistUri.split('/');
    const gistId = parts[parts.length - 1];

    if (!gistId) {
      return NextResponse.json(
        { error: 'Invalid gist URI' },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Initialize Octokit with token
    const octokit = new Octokit({
      auth: githubToken,
    });

    try {
      const response = await octokit.request('GET /gists/{gist_id}', {
        gist_id: gistId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      const gist = response.data;
      const description = gist.description || '';
      const gistFiles = gist.files;
      const files: { [key: string]: string } = {};

      for (const fname in gistFiles) {
        const file = gistFiles[fname];
        if (!file) continue;
        const content = file.content;
        if (content === undefined) continue;
        files[fname] = content;
      }

      return NextResponse.json(
        { files, description },
        { 
          status: 200,
          headers: corsHeaders,
        }
      );
    } catch (error: unknown) {
      console.error('Error loading gist:', error);
      
      // Handle specific GitHub API errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return NextResponse.json(
          { error: 'Gist not found' },
          { 
            status: 404,
            headers: corsHeaders,
          }
        );
      }
      
      if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
        return NextResponse.json(
          { error: 'Access forbidden - gist may be private' },
          { 
            status: 403,
            headers: corsHeaders,
          }
        );
      }

      return NextResponse.json(
        { error: 'Failed to load gist' },
        { 
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
