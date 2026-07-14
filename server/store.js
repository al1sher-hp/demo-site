import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { todayIso } from './dateUtil.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'bookings.json');

function readBookings() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
}

export function getBookingsForMasterDate(masterId, date) {
  return readBookings().filter((b) => b.masterId === masterId && b.date === date);
}

export function isSlotTaken(masterId, date, time) {
  return readBookings().some((b) => b.masterId === masterId && b.date === date && b.time === time);
}

export function addBooking(booking) {
  const bookings = readBookings();
  const newBooking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...booking,
  };
  bookings.push(newBooking);
  writeBookings(bookings);
  return newBooking;
}

export function getTodayBookings() {
  const today = todayIso();
  return readBookings()
    .filter((b) => b.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
}
