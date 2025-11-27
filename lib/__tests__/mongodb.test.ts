import mongoose from 'mongoose';
import connectDB from '../mongodb';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('MongoDB Connection Utility', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockConnect: jest.MockedFunction<typeof mongoose.connect>;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    
    // Setup mock
    mockConnect = mongoose.connect as jest.MockedFunction<typeof mongoose.connect>;
    mockConnect.mockClear();
    
    // Clear the global cache
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    
    // Clear global cache
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
  });

  describe('Environment Variable Validation', () => {
    test('should throw error when MONGODB_URI is not defined', async () => {
      delete process.env.MONGODB_URI;
      
      await expect(connectDB()).rejects.toThrow(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    });

    test('should not throw error when MONGODB_URI is defined', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      await expect(connectDB()).resolves.toBeDefined();
    });

    test('should accept valid MongoDB connection strings', async () => {
      const validURIs = [
        'mongodb://localhost:27017/testdb',
        'mongodb://user:pass@localhost:27017/testdb',
        'mongodb+srv://cluster.mongodb.net/testdb',
        'mongodb://host1:27017,host2:27017/testdb?replicaSet=myReplSet',
      ];

      for (const uri of validURIs) {
        process.env.MONGODB_URI = uri;
        mockConnect.mockResolvedValue(mongoose);
        
        await connectDB();
        expect(mockConnect).toHaveBeenCalledWith(uri, expect.any(Object));
        
        // Clear cache between iterations
        if (global.mongoose) {
          global.mongoose = { conn: null, promise: null };
        }
        mockConnect.mockClear();
      }
    });
  });

  describe('Connection Caching', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
    });

    test('should create new connection on first call', async () => {
      await connectDB();
      
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledWith(
        process.env.MONGODB_URI,
        { bufferCommands: false }
      );
    });

    test('should return cached connection on subsequent calls', async () => {
      // First call
      const conn1 = await connectDB();
      expect(mockConnect).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      const conn2 = await connectDB();
      expect(mockConnect).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(conn1).toBe(conn2);
    });

    test('should not create multiple connections for concurrent calls', async () => {
      // Make multiple concurrent calls
      const promises = [
        connectDB(),
        connectDB(),
        connectDB(),
      ];
      
      await Promise.all(promises);
      
      // Should only call connect once
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    test('should initialize global cache on first import', () => {
      // After import, global.mongoose should be defined
      expect(global.mongoose).toBeDefined();
      expect(global.mongoose).toEqual({ conn: null, promise: null });
    });

    test('should preserve cache across module reloads', async () => {
      await connectDB();
      
      // Simulate module reload by requiring again
      const connectDB2 = require('../mongodb').default;
      
      mockConnect.mockClear();
      await connectDB2();
      
      // Should not call connect again
      expect(mockConnect).not.toHaveBeenCalled();
    });
  });

  describe('Connection Options', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
    });

    test('should pass bufferCommands: false option', async () => {
      await connectDB();
      
      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ bufferCommands: false })
      );
    });

    test('should use only specified options', async () => {
      await connectDB();
      
      const callArgs = mockConnect.mock.calls[0];
      const options = callArgs[1];
      
      expect(Object.keys(options)).toHaveLength(1);
      expect(options).toEqual({ bufferCommands: false });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    });

    test('should handle connection errors', async () => {
      const connectionError = new Error('Connection failed');
      mockConnect.mockRejectedValue(connectionError);
      
      await expect(connectDB()).rejects.toThrow('Connection failed');
    });

    test('should reset promise cache on connection error', async () => {
      mockConnect.mockRejectedValue(new Error('Connection failed'));
      
      // First attempt fails
      await expect(connectDB()).rejects.toThrow();
      
      // Promise should be reset
      expect(global.mongoose?.promise).toBeNull();
    });

    test('should allow retry after connection error', async () => {
      // First attempt fails
      mockConnect.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(connectDB()).rejects.toThrow();
      
      // Second attempt succeeds
      mockConnect.mockResolvedValueOnce(mongoose);
      await expect(connectDB()).resolves.toBeDefined();
      
      expect(mockConnect).toHaveBeenCalledTimes(2);
    });

    test('should handle network timeout errors', async () => {
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'MongoNetworkError';
      mockConnect.mockRejectedValue(timeoutError);
      
      await expect(connectDB()).rejects.toThrow('Connection timeout');
    });

    test('should handle authentication errors', async () => {
      const authError = new Error('Authentication failed');
      authError.name = 'MongoAuthError';
      mockConnect.mockRejectedValue(authError);
      
      await expect(connectDB()).rejects.toThrow('Authentication failed');
    });

    test('should handle server selection timeout', async () => {
      const serverError = new Error('Server selection timeout');
      serverError.name = 'MongoServerSelectionError';
      mockConnect.mockRejectedValue(serverError);
      
      await expect(connectDB()).rejects.toThrow('Server selection timeout');
    });
  });

  describe('Promise Management', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    });

    test('should store connection promise in cache', async () => {
      mockConnect.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(mongoose), 10);
        });
      });
      
      const connectPromise = connectDB();
      
      // Promise should be stored in cache immediately
      expect(global.mongoose?.promise).toBeDefined();
      
      await connectPromise;
    });

    test('should wait for existing connection promise', async () => {
      let resolveFirst: (value: typeof mongoose) => void;
      const firstPromise = new Promise<typeof mongoose>(resolve => {
        resolveFirst = resolve;
      });
      
      mockConnect.mockReturnValueOnce(firstPromise);
      
      // Start first connection
      const conn1Promise = connectDB();
      
      // Start second connection immediately
      const conn2Promise = connectDB();
      
      // Resolve first connection
      resolveFirst!(mongoose);
      
      const [conn1, conn2] = await Promise.all([conn1Promise, conn2Promise]);
      
      expect(conn1).toBe(conn2);
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    test('should handle promise rejection', async () => {
      const error = new Error('Promise rejected');
      mockConnect.mockRejectedValue(error);
      
      await expect(connectDB()).rejects.toThrow(error);
      expect(global.mongoose?.promise).toBeNull();
    });
  });

  describe('Return Value', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
    });

    test('should return mongoose instance', async () => {
      const result = await connectDB();
      expect(result).toBe(mongoose);
    });

    test('should return same instance on multiple calls', async () => {
      const result1 = await connectDB();
      const result2 = await connectDB();
      const result3 = await connectDB();
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('Type Safety', () => {
    test('should have correct TypeScript types', () => {
      // This is a compile-time check, but we can verify the return type
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      const result = connectDB();
      expect(result).toBeInstanceOf(Promise);
    });

    test('should accept typeof mongoose as return value', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      const result: typeof mongoose = await connectDB();
      expect(result).toBe(mongoose);
    });
  });

  describe('Global Cache Structure', () => {
    test('should have correct cache structure', () => {
      expect(global.mongoose).toBeDefined();
      expect(global.mongoose).toHaveProperty('conn');
      expect(global.mongoose).toHaveProperty('promise');
    });

    test('should initialize cache with null values', () => {
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      expect(global.mongoose?.conn).toBeNull();
      expect(global.mongoose?.promise).toBeNull();
    });

    test('should update cache after successful connection', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      await connectDB();
      
      expect(global.mongoose?.conn).toBe(mongoose);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty MONGODB_URI', async () => {
      process.env.MONGODB_URI = '';
      
      await expect(connectDB()).rejects.toThrow(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    });

    test('should handle whitespace-only MONGODB_URI', async () => {
      process.env.MONGODB_URI = '   ';
      mockConnect.mockResolvedValue(mongoose);
      
      // Mongoose will handle validation of the URI
      await connectDB();
      expect(mockConnect).toHaveBeenCalledWith('   ', expect.any(Object));
    });

    test('should handle very long connection strings', async () => {
      const longURI = 'mongodb://' + 'a'.repeat(1000) + '.com/testdb';
      process.env.MONGODB_URI = longURI;
      mockConnect.mockResolvedValue(mongoose);
      
      await connectDB();
      expect(mockConnect).toHaveBeenCalledWith(longURI, expect.any(Object));
    });

    test('should handle connection strings with special characters', async () => {
      process.env.MONGODB_URI = 'mongodb://user:p@ss%20word@localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      await connectDB();
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('Hot Reload Compatibility', () => {
    test('should persist connection across hot reloads', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      // First connection
      await connectDB();
      const firstCallCount = mockConnect.mock.calls.length;
      
      // Simulate hot reload by not clearing global cache
      mockConnect.mockClear();
      
      // Second call after hot reload
      await connectDB();
      
      // Should use cached connection
      expect(mockConnect).not.toHaveBeenCalled();
    });

    test('should maintain connection state in global scope', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      mockConnect.mockResolvedValue(mongoose);
      
      await connectDB();
      
      // Global cache should persist
      expect(global.mongoose?.conn).toBe(mongoose);
      expect(global.mongoose?.promise).toBeDefined();
    });
  });
});