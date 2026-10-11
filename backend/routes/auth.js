'use strict';
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA = path.join(__dirname, '..', 'data', 'users.json');
const SECRET = process.env.AUTH_SECRET || 'huda-dev-secret-change-me';
if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET === 'huda-dev-secret-change-me' || process.env.AUTH_SECRET === 'change-this-long-random-string' || process.env.AUTH_SECRET.length < 32) {
    throw new Error('[Auth] AUTH_SECRET must be set to a strong random string (>=32 chars) in production');
  }
}


function readUsers() {
  try {
    if (!fs.existsSync(DATA)) return [];
    return JSON.parse(fs.readFileSync(DATA, 'utf8'));
  } catch (e) {
    return [];
  }
}
function writeUsers(list) {
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, JSON.stringify(list, null, 2), 'utf8');
}


// Simple in-memory rate limit (per IP) for auth endpoints
const _authHits = new Map();
function authRateLimit(req, res, max = 20, windowMs = 15 * 60 * 1000) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString().split(',')[0].trim();
  const now = Date.now();
  let e = _authHits.get(ip);
  if (!e || now - e.start > windowMs) e = { start: now, count: 0 };
  e.count += 1;
  _authHits.set(ip, e);
  if (e.count > max) {
    res.status(429).json({ success: false, error: 'محاولات كثيرة — حاول لاحقاً' });
    return false;
  }
  return true;
}

function scryptHash(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, hash: scryptHash(password, salt) };
}
function verifyPassword(password, salt, hash) {
  const h = scryptHash(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(hash, 'hex'));
  } catch (e) {
    return false;
  }
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}
function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expect = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  } catch (e) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch (e) {
    return null;
  }
}

function publicUser(u) {
  return { id: u.id, name: u.name, username: u.username, createdAt: u.createdAt };
}

const USER_RE = /^[A-Za-z][A-Za-z0-9_]{2,20}$/;

router.post('/register', (req, res) => {
  if (!authRateLimit(req, res, 10)) return;
  const name = String((req.body && req.body.name) || '').trim();
  const username = String((req.body && req.body.username) || '').trim().toLowerCase();
  const password = String((req.body && req.body.password) || '');

  if (name.length < 2 || name.length > 40) {
    return res.status(400).json({ success: false, error: 'الاسم يجب أن يكون بين 2 و 40 حرفًا' });
  }
  if (!USER_RE.test(username)) {
    return res.status(400).json({ success: false, error: 'اليوزر: إنجليزي يبدأ بحرف، 3–21 (أرقام و _ فقط)' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'كلمة المرور 6 أحرف على الأقل' });
  }

  const users = readUsers();
  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ success: false, error: 'اسم المستخدم مستخدم بالفعل' });
  }

  const { salt, hash } = hashPassword(password);
  const user = {
    id: crypto.randomBytes(8).toString('hex'),
    name,
    username,
    salt,
    hash,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);

  const token = signToken({ id: user.id, username: user.username, exp: Date.now() + 30 * 864e5 });
  res.status(201).json({ success: true, token, user: publicUser(user) });
});

router.post('/login', (req, res) => {
  if (!authRateLimit(req, res, 25)) return;
  const username = String((req.body && req.body.username) || '').trim().toLowerCase();
  const password = String((req.body && req.body.password) || '');
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !verifyPassword(password, user.salt, user.hash)) {
    return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }
  const token = signToken({ id: user.id, username: user.username, exp: Date.now() + 30 * 864e5 });
  res.json({ success: true, token, user: publicUser(user) });
});

router.get('/me', (req, res) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload || (payload.exp && payload.exp < Date.now())) {
    return res.status(401).json({ success: false, error: 'غير مصرح' });
  }
  const users = readUsers();
  const user = users.find((u) => u.id === payload.id);
  if (!user) return res.status(401).json({ success: false, error: 'المستخدم غير موجود' });
  res.json({ success: true, user: publicUser(user) });
});

module.exports = router;
