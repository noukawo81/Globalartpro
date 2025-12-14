#!/usr/bin/env node
/* Simple integration test: register user, create artist, upload a small file */
import fs from 'fs';
import path from 'path';

const API = process.env.API_URL || 'http://localhost:3000/api';

function rand(n = 6) {
  return Math.random().toString(36).slice(2, 2 + n);
}

async function main() {
  const name = `Test User ${rand()}`;
  const email = `test+${rand()}@example.com`;
  const password = 'password123';

  console.log('Registering user...', email);
  let r = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: 'artist' }),
  });
  const reg = await r.json();
  if (!reg.token) throw new Error('register failed: ' + JSON.stringify(reg));
  const token = reg.token;
  console.log('Got token for user', reg.user.id);

  // create artist
  const artistId = `artist-${Date.now()}`;
  console.log('Creating artist', artistId);
  r = await fetch(`${API}/artists`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: artistId, name: `Artist ${rand()}`, owner: reg.user.id }),
  });
  const createResp = await r.json();
  if (!createResp.id && !createResp.id === artistId) {
    console.warn('Artist create response:', createResp);
  }

  // prepare a small text file as upload (base64 JSON fallback)
  const fileContent = 'Hello GlobalArtPro\nThis is a test upload.';
  const fileName = `test-upload-${Date.now()}.txt`;
  const fileBase64 = Buffer.from(fileContent).toString('base64');

  console.log('Uploading file to artist (base64 fallback)', artistId);
  r = await fetch(`${API}/artists/${artistId}/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ fileBase64, fileName, mimetype: 'text/plain', title: 'Integration test upload', kind: 'text' }),
  });
  const uploadResp = await r.json();
  console.log('Upload response:', uploadResp);

  if (uploadResp.media && uploadResp.media.url) {
    console.log('Upload successful, URL:', uploadResp.media.url);
  } else {
    console.error('Upload failed');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
