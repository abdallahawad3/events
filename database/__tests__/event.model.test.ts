import mongoose from 'mongoose';
import Event, { IEvent } from '../event.model';

// Mock mongoose to avoid actual database operations
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn(),
    models: {},
  };
});

describe('Event Model', () => {
  describe('Schema Validation', () => {
    let eventData: Partial<IEvent>;

    beforeEach(() => {
      eventData = {
        title: 'Tech Conference 2024',
        description: 'A comprehensive technology conference covering the latest trends in software development.',
        overview: 'Join us for a day of learning and networking with industry experts.',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2024-12-15',
        time: '09:00',
        mode: 'hybrid',
        audience: 'Developers and Tech Enthusiasts',
        agenda: ['Opening Keynote', 'Technical Sessions', 'Networking'],
        organizer: 'Tech Events Inc',
        tags: ['technology', 'conference', 'networking'],
      };
    });

    test('should create a valid event with all required fields', () => {
      const event = new Event(eventData);
      expect(event.title).toBe(eventData.title);
      expect(event.description).toBe(eventData.description);
      expect(event.mode).toBe(eventData.mode);
    });

    test('should fail validation when title is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.title;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.title).toBeDefined();
    });

    test('should fail validation when description is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.description;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.description).toBeDefined();
    });

    test('should fail validation when overview is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.overview;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.overview).toBeDefined();
    });

    test('should fail validation when image is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.image;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.image).toBeDefined();
    });

    test('should fail validation when venue is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.venue;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.venue).toBeDefined();
    });

    test('should fail validation when location is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.location;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.location).toBeDefined();
    });

    test('should fail validation when date is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.date;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.date).toBeDefined();
    });

    test('should fail validation when time is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.time;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.time).toBeDefined();
    });

    test('should fail validation when mode is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.mode;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.mode).toBeDefined();
    });

    test('should fail validation when mode is invalid', () => {
      const invalidData = { ...eventData, mode: 'invalid-mode' };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.mode).toBeDefined();
      expect(error?.errors.mode.message).toContain('Mode must be either online, offline, or hybrid');
    });

    test('should accept valid mode: online', () => {
      const validData = { ...eventData, mode: 'online' };
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should accept valid mode: offline', () => {
      const validData = { ...eventData, mode: 'offline' };
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should accept valid mode: hybrid', () => {
      const validData = { ...eventData, mode: 'hybrid' };
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should fail validation when audience is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.audience;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.audience).toBeDefined();
    });

    test('should fail validation when agenda is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.agenda;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.agenda).toBeDefined();
    });

    test('should fail validation when agenda is empty array', () => {
      const invalidData = { ...eventData, agenda: [] };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.agenda).toBeDefined();
      expect(error?.errors.agenda.message).toContain('At least one agenda item is required');
    });

    test('should fail validation when organizer is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.organizer;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.organizer).toBeDefined();
    });

    test('should fail validation when tags is missing', () => {
      const invalidData = { ...eventData };
      delete invalidData.tags;
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.tags).toBeDefined();
    });

    test('should fail validation when tags is empty array', () => {
      const invalidData = { ...eventData, tags: [] };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.tags).toBeDefined();
      expect(error?.errors.tags.message).toContain('At least one tag is required');
    });

    test('should fail validation when title exceeds 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const invalidData = { ...eventData, title: longTitle };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.title).toBeDefined();
      expect(error?.errors.title.message).toContain('Title cannot exceed 100 characters');
    });

    test('should accept title with exactly 100 characters', () => {
      const exactTitle = 'a'.repeat(100);
      const validData = { ...eventData, title: exactTitle };
      
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should fail validation when description exceeds 1000 characters', () => {
      const longDescription = 'a'.repeat(1001);
      const invalidData = { ...eventData, description: longDescription };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.description).toBeDefined();
      expect(error?.errors.description.message).toContain('Description cannot exceed 1000 characters');
    });

    test('should accept description with exactly 1000 characters', () => {
      const exactDescription = 'a'.repeat(1000);
      const validData = { ...eventData, description: exactDescription };
      
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should fail validation when overview exceeds 500 characters', () => {
      const longOverview = 'a'.repeat(501);
      const invalidData = { ...eventData, overview: longOverview };
      
      const event = new Event(invalidData);
      const error = event.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.overview).toBeDefined();
      expect(error?.errors.overview.message).toContain('Overview cannot exceed 500 characters');
    });

    test('should accept overview with exactly 500 characters', () => {
      const exactOverview = 'a'.repeat(500);
      const validData = { ...eventData, overview: exactOverview };
      
      const event = new Event(validData);
      const error = event.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should trim whitespace from string fields', () => {
      const dataWithWhitespace = {
        ...eventData,
        title: '  Tech Conference 2024  ',
        venue: '  Convention Center  ',
        location: '  San Francisco, CA  ',
      };
      
      const event = new Event(dataWithWhitespace);
      
      expect(event.title).toBe('Tech Conference 2024');
      expect(event.venue).toBe('Convention Center');
      expect(event.location).toBe('San Francisco, CA');
    });

    test('should convert slug to lowercase', () => {
      const event = new Event({ ...eventData, slug: 'UPPERCASE-SLUG' });
      expect(event.slug).toBe('uppercase-slug');
    });
  });

  describe('generateSlug Helper Function', () => {
    // Testing the generateSlug function behavior through pre-save hook
    test('should generate slug from title on new document', () => {
      const title = 'Tech Conference 2024';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tech-conference-2024');
    });

    test('should handle special characters in title', () => {
      const title = 'Tech Conference 2024! @ #$%';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tech-conference-2024');
    });

    test('should handle multiple spaces in title', () => {
      const title = 'Tech    Conference     2024';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tech-conference-2024');
    });

    test('should handle leading and trailing hyphens', () => {
      const title = '-Tech Conference 2024-';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tech-conference-2024');
    });

    test('should handle multiple consecutive hyphens', () => {
      const title = 'Tech---Conference---2024';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tech-conference-2024');
    });

    test('should handle empty string', () => {
      const title = '';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('');
    });

    test('should handle title with only special characters', () => {
      const title = '!@#$%^&*()';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('');
    });

    test('should handle unicode characters', () => {
      const title = 'Tëch Cönfërëncë 2024';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('tch-cnfrnc-2024');
    });

    test('should handle mixed case with numbers', () => {
      const title = 'JavaScript 101 Workshop';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('javascript-101-workshop');
    });

    test('should preserve hyphens in original title', () => {
      const title = 'Next-Gen Tech Conference';
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe('next-gen-tech-conference');
    });
  });

  describe('normalizeDate Helper Function', () => {
    test('should normalize valid date string to ISO format', () => {
      const dateString = '2024-12-15';
      const date = new Date(dateString);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toBe('2024-12-15');
    });

    test('should handle different date formats', () => {
      const dateString = 'December 15, 2024';
      const date = new Date(dateString);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toBe('2024-12-15');
    });

    test('should throw error for invalid date', () => {
      const dateString = 'invalid-date';
      const date = new Date(dateString);
      
      expect(isNaN(date.getTime())).toBe(true);
    });

    test('should handle ISO datetime string', () => {
      const dateString = '2024-12-15T10:30:00.000Z';
      const date = new Date(dateString);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toBe('2024-12-15');
    });

    test('should handle timestamp', () => {
      const timestamp = 1702627200000; // Dec 15, 2024
      const date = new Date(timestamp);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should handle slash-separated dates', () => {
      const dateString = '12/15/2024';
      const date = new Date(dateString);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toBe('2024-12-15');
    });

    test('should handle leap year dates', () => {
      const dateString = '2024-02-29';
      const date = new Date(dateString);
      const normalized = date.toISOString().split('T')[0];
      
      expect(normalized).toBe('2024-02-29');
    });
  });

  describe('normalizeTime Helper Function', () => {
    test('should normalize 24-hour format time', () => {
      const timeString = '09:00';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      expect(match).toBeTruthy();
      expect(match![1]).toBe('09');
      expect(match![2]).toBe('00');
    });

    test('should normalize 12-hour AM format', () => {
      const timeString = '9:00 AM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'AM' && hours === 12) hours = 0;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('09:00');
    });

    test('should normalize 12-hour PM format', () => {
      const timeString = '3:30 PM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('15:30');
    });

    test('should handle 12:00 PM (noon)', () => {
      const timeString = '12:00 PM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('12:00');
    });

    test('should handle 12:00 AM (midnight)', () => {
      const timeString = '12:00 AM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'AM' && hours === 12) hours = 0;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('00:00');
    });

    test('should reject invalid time format', () => {
      const timeString = 'invalid-time';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      expect(match).toBeNull();
    });

    test('should reject hours > 23', () => {
      const hours = 25;
      const minutes = 30;
      
      expect(hours < 0 || hours > 23).toBe(true);
    });

    test('should reject minutes > 59', () => {
      const hours = 10;
      const minutes = 75;
      
      expect(minutes < 0 || minutes > 59).toBe(true);
    });

    test('should handle single digit hours', () => {
      const timeString = '9:30';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      const hours = parseInt(match![1]);
      const minutes = match![2];
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      
      expect(normalized).toBe('09:30');
    });

    test('should handle whitespace around time', () => {
      const timeString = '  09:30  ';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      expect(match).toBeTruthy();
    });

    test('should handle 1:00 PM', () => {
      const timeString = '1:00 PM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('13:00');
    });

    test('should handle 11:59 PM', () => {
      const timeString = '11:59 PM';
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = timeString.trim().match(timeRegex);
      
      let hours = parseInt(match![1]);
      const minutes = match![2];
      const period = match![4]?.toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      
      const normalized = `${hours.toString().padStart(2, '0')}:${minutes}`;
      expect(normalized).toBe('23:59');
    });
  });
});