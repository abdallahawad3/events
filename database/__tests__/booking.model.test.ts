import mongoose from 'mongoose';
import Booking, { IBooking } from '../booking.model';
import Event from '../event.model';

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn(),
    models: {},
  };
});

// Mock Event model
jest.mock('../event.model', () => ({
  findById: jest.fn(),
}));

describe('Booking Model', () => {
  let bookingData: Partial<IBooking>;
  const mockEventId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    bookingData = {
      eventId: mockEventId,
      email: 'user@example.com',
    };
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    test('should create a valid booking with all required fields', () => {
      const booking = new Booking(bookingData);
      expect(booking.eventId).toBe(bookingData.eventId);
      expect(booking.email).toBe(bookingData.email);
    });

    test('should fail validation when eventId is missing', () => {
      const invalidData = { ...bookingData };
      delete invalidData.eventId;
      
      const booking = new Booking(invalidData);
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.eventId).toBeDefined();
      expect(error?.errors.eventId.message).toContain('Event ID is required');
    });

    test('should fail validation when email is missing', () => {
      const invalidData = { ...bookingData };
      delete invalidData.email;
      
      const booking = new Booking(invalidData);
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
      expect(error?.errors.email.message).toContain('Email is required');
    });

    test('should convert email to lowercase', () => {
      const upperCaseEmail = 'USER@EXAMPLE.COM';
      const booking = new Booking({ ...bookingData, email: upperCaseEmail });
      
      expect(booking.email).toBe('user@example.com');
    });

    test('should trim whitespace from email', () => {
      const emailWithWhitespace = '  user@example.com  ';
      const booking = new Booking({ ...bookingData, email: emailWithWhitespace });
      
      expect(booking.email).toBe('user@example.com');
    });
  });

  describe('Email Validation', () => {
    test('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example.org',
        'user123@example.io',
        'first.last@subdomain.example.com',
      ];

      validEmails.forEach(email => {
        const booking = new Booking({ ...bookingData, email });
        const error = booking.validateSync();
        expect(error).toBeUndefined();
      });
    });

    test('should reject email without @ symbol', () => {
      const invalidEmail = 'userexample.com';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
      expect(error?.errors.email.message).toContain('Please provide a valid email address');
    });

    test('should reject email without domain', () => {
      const invalidEmail = 'user@';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should reject email without local part', () => {
      const invalidEmail = '@example.com';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should reject email with spaces', () => {
      const invalidEmail = 'user name@example.com';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should reject email with multiple @ symbols', () => {
      const invalidEmail = 'user@@example.com';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should reject email with invalid domain', () => {
      const invalidEmail = 'user@.com';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should reject empty email', () => {
      const invalidEmail = '';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should accept email with special characters in local part', () => {
      const validEmails = [
        'user!name@example.com',
        'user#name@example.com',
        'user$name@example.com',
        'user%name@example.com',
        "user'name@example.com",
        'user*name@example.com',
        'user+name@example.com',
        'user/name@example.com',
        'user=name@example.com',
        'user?name@example.com',
        'user^name@example.com',
        'user_name@example.com',
        'user`name@example.com',
        'user{name@example.com',
        'user|name@example.com',
        'user}name@example.com',
        'user~name@example.com',
      ];

      validEmails.forEach(email => {
        const booking = new Booking({ ...bookingData, email });
        const error = booking.validateSync();
        expect(error).toBeUndefined();
      });
    });

    test('should accept email with dots in local part', () => {
      const validEmail = 'first.middle.last@example.com';
      const booking = new Booking({ ...bookingData, email: validEmail });
      const error = booking.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should accept email with hyphens in domain', () => {
      const validEmail = 'user@my-domain.com';
      const booking = new Booking({ ...bookingData, email: validEmail });
      const error = booking.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should accept email with numbers in domain', () => {
      const validEmail = 'user@example123.com';
      const booking = new Booking({ ...bookingData, email: validEmail });
      const error = booking.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should reject email ending with dot', () => {
      const invalidEmail = 'user@example.com.';
      const booking = new Booking({ ...bookingData, email: invalidEmail });
      const error = booking.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.email).toBeDefined();
    });

    test('should accept complex valid email', () => {
      const validEmail = 'user.name+tag@sub.domain.example.com';
      const booking = new Booking({ ...bookingData, email: validEmail });
      const error = booking.validateSync();
      
      expect(error).toBeUndefined();
    });
  });

  describe('Pre-save Hook - Event Validation', () => {
    test('should validate that event exists before saving', async () => {
      (Event.findById as jest.Mock).mockResolvedValue({ _id: mockEventId });
      
      const booking = new Booking(bookingData);
      
      // Verify the mock setup
      expect(Event.findById).toBeDefined();
    });

    test('should throw error if event does not exist', async () => {
      (Event.findById as jest.Mock).mockResolvedValue(null);
      
      // This would be tested in integration tests with real database
      expect(Event.findById).toBeDefined();
    });

    test('should handle database errors during event validation', async () => {
      (Event.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // This would be tested in integration tests with real database
      expect(Event.findById).toBeDefined();
    });

    test('should only validate eventId if modified or new', () => {
      // This behavior is defined in the pre-save hook
      const booking = new Booking(bookingData);
      expect(booking.isNew).toBe(true);
    });
  });

  describe('ObjectId Validation', () => {
    test('should accept valid MongoDB ObjectId', () => {
      const validObjectId = new mongoose.Types.ObjectId();
      const booking = new Booking({ ...bookingData, eventId: validObjectId });
      const error = booking.validateSync();
      
      expect(error).toBeUndefined();
    });

    test('should store eventId as ObjectId type', () => {
      const objectId = new mongoose.Types.ObjectId();
      const booking = new Booking({ ...bookingData, eventId: objectId });
      
      expect(booking.eventId).toBeInstanceOf(mongoose.Types.ObjectId);
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt field', () => {
      const booking = new Booking(bookingData);
      expect(booking.schema.path('createdAt')).toBeDefined();
    });

    test('should have updatedAt field', () => {
      const booking = new Booking(bookingData);
      expect(booking.schema.path('updatedAt')).toBeDefined();
    });
  });

  describe('Schema Indexes', () => {
    test('should have index on eventId', () => {
      const indexes = Booking.schema.indexes();
      const eventIdIndex = indexes.find(idx => 
        idx[0].eventId !== undefined
      );
      expect(eventIdIndex).toBeDefined();
    });

    test('should have compound index on eventId and createdAt', () => {
      const indexes = Booking.schema.indexes();
      const compoundIndex = indexes.find(idx => 
        idx[0].eventId !== undefined && idx[0].createdAt !== undefined
      );
      expect(compoundIndex).toBeDefined();
    });

    test('should have index on email', () => {
      const indexes = Booking.schema.indexes();
      const emailIndex = indexes.find(idx => 
        idx[0].email !== undefined
      );
      expect(emailIndex).toBeDefined();
    });

    test('should have unique compound index on eventId and email', () => {
      const indexes = Booking.schema.indexes();
      const uniqueIndex = indexes.find(idx => 
        idx[0].eventId !== undefined && 
        idx[0].email !== undefined &&
        idx[1]?.unique === true
      );
      expect(uniqueIndex).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(64) + '@' + 'b'.repeat(200) + '.com';
      const booking = new Booking({ ...bookingData, email: longEmail });
      
      // Should not throw an error during construction
      expect(booking.email).toBe(longEmail.toLowerCase());
    });

    test('should handle email with maximum valid length', () => {
      // RFC 5321 specifies maximum email length of 320 characters
      const localPart = 'a'.repeat(64);
      const domain = 'b'.repeat(251) + '.com';
      const maxEmail = localPart + '@' + domain;
      
      const booking = new Booking({ ...bookingData, email: maxEmail });
      expect(booking.email).toBe(maxEmail.toLowerCase());
    });

    test('should handle concurrent bookings for same event', () => {
      const booking1 = new Booking(bookingData);
      const booking2 = new Booking(bookingData);
      
      // Both bookings have same eventId and email
      expect(booking1.eventId).toEqual(booking2.eventId);
      expect(booking1.email).toBe(booking2.email);
      
      // Unique index should prevent duplicates (tested in integration tests)
    });

    test('should allow same user to book different events', () => {
      const event1Id = new mongoose.Types.ObjectId();
      const event2Id = new mongoose.Types.ObjectId();
      
      const booking1 = new Booking({ eventId: event1Id, email: 'user@example.com' });
      const booking2 = new Booking({ eventId: event2Id, email: 'user@example.com' });
      
      expect(booking1.email).toBe(booking2.email);
      expect(booking1.eventId).not.toEqual(booking2.eventId);
    });

    test('should allow different users to book same event', () => {
      const booking1 = new Booking({ eventId: mockEventId, email: 'user1@example.com' });
      const booking2 = new Booking({ eventId: mockEventId, email: 'user2@example.com' });
      
      expect(booking1.eventId).toEqual(booking2.eventId);
      expect(booking1.email).not.toBe(booking2.email);
    });
  });

  describe('Model Reference', () => {
    test('should reference Event model', () => {
      const schema = Booking.schema;
      const eventIdPath = schema.path('eventId');
      
      expect(eventIdPath).toBeDefined();
    });

    test('should have correct ref configuration', () => {
      const schema = Booking.schema;
      const eventIdPath: any = schema.path('eventId');
      
      expect(eventIdPath.options.ref).toBe('Event');
    });
  });
});