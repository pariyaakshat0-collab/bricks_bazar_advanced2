import { createClient, RedisClientType } from 'redis';

interface ExtendedRedisCommands {
  zAdd(key: string, score: number, member: string): Promise<number>;
  setEx(key: string, seconds: number, value: string): Promise<string>;
  sendCommand(args: string[]): Promise<any>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<boolean>;
  xAdd(key: string, id: string, ...args: string[]): Promise<string>;
  lPush(key: string, elements: string[]): Promise<number>;
  rPush(key: string, elements: string[]): Promise<number>;
  lPop(key: string): Promise<string | null>;
  rPop(key: string): Promise<string | null>;
  lLen(key: string): Promise<number>;
  lRange(key: string, start: number, stop: number): Promise<string[]>;
  sAdd(key: string, members: string[]): Promise<number>;
  sRem(key: string, members: string[]): Promise<number>;
  sMembers(key: string): Promise<string[]>;
  sIsMember(key: string, member: string): Promise<number>;
  hSet(key: string, field: string, value: string): Promise<number>;
  hGet(key: string, field: string): Promise<string | null>;
  hDel(key: string, field: string): Promise<number>;
  hGetAll(key: string): Promise<Record<string, string>>;
}

export class Redis {
  private client: RedisClientType<ExtendedRedisCommands>;
  private isConnected: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        }
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string | Record<string, any>): Promise<void> {
    if (!this.isConnected) return;
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.set(key, stringValue);
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  async setex(key: string, seconds: number, value: string | Record<string, any>): Promise<void> {
    if (!this.isConnected) return;
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.setEx(key, seconds, stringValue);
    } catch (error) {
      console.error('Redis SETEX error:', error);
    }
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.zAdd(key, [{ score, value: member }]);
    } catch (error) {
      console.error('Redis ZADD error:', error);
      return 0;
    }
  }

  async send_command(command: string, ...args: any[]): Promise<any> {
    if (!this.isConnected) return null;
    try {
      return await this.client.sendCommand([command, ...args]);
    } catch (error) {
      console.error(`Redis ${command} error:`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isConnected) return -2;
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -2;
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.decr(key);
    } catch (error) {
      console.error('Redis DECR error:', error);
      return 0;
    }
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.lPush(key, values);
    } catch (error) {
      console.error('Redis LPUSH error:', error);
      return 0;
    }
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.rPush(key, values);
    } catch (error) {
      console.error('Redis RPUSH error:', error);
      return 0;
    }
  }

  async lpop(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.lPop(key);
    } catch (error) {
      console.error('Redis LPOP error:', error);
      return null;
    }
  }

  async rpop(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.rPop(key);
    } catch (error) {
      console.error('Redis RPOP error:', error);
      return null;
    }
  }

  async llen(key: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.lLen(key);
    } catch (error) {
      console.error('Redis LLEN error:', error);
      return 0;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.isConnected) return [];
    try {
      return await this.client.lRange(key, start, stop);
    } catch (error) {
      console.error('Redis LRANGE error:', error);
      return [];
    }
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.sAdd(key, members);
    } catch (error) {
      console.error('Redis SADD error:', error);
      return 0;
    }
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.sRem(key, members);
    } catch (error) {
      console.error('Redis SREM error:', error);
      return 0;
    }
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.isConnected) return [];
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      console.error('Redis SMEMBERS error:', error);
      return [];
    }
  }

  async sismember(key: string, member: string): Promise<boolean> {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.sIsMember(key, member);
      return result === 1;
    } catch (error) {
      console.error('Redis SISMEMBER error:', error);
      return false;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.hSet(key, field, value);
    } catch (error) {
      console.error('Redis HSET error:', error);
      return 0;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      console.error('Redis HGET error:', error);
      return null;
    }
  }

  async hdel(key: string, field: string): Promise<number> {
    if (!this.isConnected) return 0;
    try {
      return await this.client.hDel(key, field);
    } catch (error) {
      console.error('Redis HDEL error:', error);
      return 0;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.isConnected) return {};
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      console.error('Redis HGETALL error:', error);
      return {};
    }
  }

  async xadd(key: string, id: string, ...args: string[]): Promise<string> {
    if (!this.isConnected) return '';
    try {
      return await this.client.xAdd(key, id, args);
    } catch (error) {
      console.error('Redis XADD error:', error);
      return '';
    }
  }

  async xread(keys: string[], ids: string[]): Promise<any[]> {
    if (!this.isConnected) return [];
    try {
      return await this.client.xRead(keys.map((key, index) => ({ key, id: ids[index] || '0' })));
    } catch (error) {
      console.error('Redis XREAD error:', error);
      return [];
    }
  }

  async flushall(): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.flushAll();
    } catch (error) {
      console.error('Redis FLUSHALL error:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.disconnect();
      this.isConnected = false;
    } catch (error) {
      console.error('Redis DISCONNECT error:', error);
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

export default Redis;