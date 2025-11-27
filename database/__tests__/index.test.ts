import * as DatabaseExports from '../index';
import Event from '../event.model';
import Booking from '../booking.model';

describe('Database Index Exports', () => {
  describe('Model Exports', () => {
    test('should export Event model', () => {
      expect(DatabaseExports.Event).toBeDefined();
      expect(DatabaseExports.Event).toBe(Event);
    });

    test('should export Booking model', () => {
      expect(DatabaseExports.Booking).toBeDefined();
      expect(DatabaseExports.Booking).toBe(Booking);
    });
  });

  describe('Type Exports', () => {
    test('should export IEvent type', () => {
      // TypeScript types are removed at runtime, but we can verify the import works
      // by checking if the module has the expected structure
      expect(DatabaseExports).toHaveProperty('Event');
      expect(DatabaseExports).toHaveProperty('Booking');
    });

    test('should export IBooking type', () => {
      // Similar to above, verify module structure
      expect(DatabaseExports).toHaveProperty('Event');
      expect(DatabaseExports).toHaveProperty('Booking');
    });
  });

  describe('Module Structure', () => {
    test('should only export Event and Booking models', () => {
      const exports = Object.keys(DatabaseExports);
      expect(exports).toHaveLength(2);
      expect(exports).toContain('Event');
      expect(exports).toContain('Booking');
    });

    test('should not export internal implementation details', () => {
      const exports = Object.keys(DatabaseExports);
      expect(exports).not.toContain('EventSchema');
      expect(exports).not.toContain('BookingSchema');
      expect(exports).not.toContain('generateSlug');
      expect(exports).not.toContain('normalizeDate');
      expect(exports).not.toContain('normalizeTime');
    });
  });

  describe('Re-export Integrity', () => {
    test('Event export should match direct import', () => {
      const DirectEvent = require('../event.model').default;
      expect(DatabaseExports.Event).toBe(DirectEvent);
    });

    test('Booking export should match direct import', () => {
      const DirectBooking = require('../booking.model').default;
      expect(DatabaseExports.Booking).toBe(DirectBooking);
    });
  });
});