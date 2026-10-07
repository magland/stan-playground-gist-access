import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// CORS configuration
const allowedOrigins = [
  'https://stan-playground.flatironinstitute.org',
  'https://magland.github.io',
  'https://flatironinstitute.github.io',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://127.0.0.1:3000',
  'https://127.0.0.1:3000'
];

const allowedPrefixes = [
  'http://localhost:',
  'https://localhost:',
  'http://127.0.0.1:',
  'https://127.0.0.1:'
];

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    allowedPrefixes.some(prefix => origin.startsWith(prefix))
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
        { exists: false },
        { 
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    // Initialize Octokit with token
    const octokit = new Octokit({
      auth: githubToken,
    });

    try {
      const response = await octokit.request('HEAD /gists/{gist_id}', {
        gist_id: gistId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      return NextResponse.json(
        { exists: response.status === 200 },
        { 
          status: 200,
          headers: corsHeaders,
        }
      );
    } catch (error) {
      return NextResponse.json(
        { exists: false },
        { 
          status: 200,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error('Error checking gist existence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
