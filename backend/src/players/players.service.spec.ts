import { Test } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PlayersService } from './players.service';
import { PrismaService } from '../prisma/prisma.service';

// A unit test isolates ONE piece of logic from everything around it.
// PlayersService normally talks to a real Postgres database through
// PrismaService — but we don't want our tests to need a real database
// running, and we don't want them to be slow or flaky. So instead of a
// real PrismaService, we hand PlayersService a *fake* one: a plain object
// with jest.fn() in place of each method we use. jest.fn() creates a
// "mock function" — something that records how it was called and lets us
// tell it what to return, without doing any real work.
describe('PlayersService', () => {
  let service: PlayersService;
  let prisma: { player: Record<string, jest.Mock> };

  beforeEach(async () => {
    // beforeEach runs before every single test below, so each test starts
    // from a clean slate — nothing left over from the previous test.
    prisma = {
      player: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    // This is Nest's testing module — the same dependency injection
    // system the real app uses, just wired up with our fake PrismaService
    // (and a real, throwaway JwtService, since signing a token doesn't
    // touch anything external and is cheap to run for real).
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'test-secret' }),
        },
      ],
    }).compile();

    service = moduleRef.get(PlayersService);
  });

  describe('findAll', () => {
    it('passes the status filter through to Prisma when given one', async () => {
      prisma.player.findMany.mockResolvedValue([]);

      await service.findAll('PENDING');

      expect(prisma.player.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('fetches every player, of any status, when no filter is given', async () => {
      prisma.player.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(prisma.player.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('never includes passwordHash in the results', async () => {
      prisma.player.findMany.mockResolvedValue([
        { id: '1', fullName: 'Alex', status: 'APPROVED', passwordHash: 'x' },
      ]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: '1', fullName: 'Alex', status: 'APPROVED' }]);
    });
  });

  describe('updateStatus', () => {
    it('updates the player when one exists with that id', async () => {
      const existing = {
        id: '1',
        fullName: 'Alex',
        status: 'PENDING',
        passwordHash: 'x',
      };
      const updated = { ...existing, status: 'APPROVED' };
      prisma.player.findUnique.mockResolvedValue(existing);
      prisma.player.update.mockResolvedValue(updated);

      const result = await service.updateStatus('1', 'APPROVED');

      expect(result).toEqual({ id: '1', fullName: 'Alex', status: 'APPROVED' });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'APPROVED' },
      });
    });

    it('throws NotFoundException when no player has that id', async () => {
      // This is the case we actually care most about catching with a
      // test: what happens on the "unhappy path". An admin clicking
      // approve on a profile that's already been deleted shouldn't crash
      // the server with a confusing error — it should return a clear
      // "not found".
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('missing-id', 'APPROVED')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.player.update).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns an access token when the password is correct', async () => {
      const passwordHash = await bcrypt.hash('correct-horse', 10);
      prisma.player.findUnique.mockResolvedValue({
        id: '1',
        email: 'alex@example.com',
        passwordHash,
      });

      const result = await service.login('alex@example.com', 'correct-horse');

      expect(result.accessToken).toEqual(expect.any(String));
    });

    it('rejects a wrong password without saying so directly', async () => {
      const passwordHash = await bcrypt.hash('correct-horse', 10);
      prisma.player.findUnique.mockResolvedValue({
        id: '1',
        email: 'alex@example.com',
        passwordHash,
      });

      await expect(
        service.login('alex@example.com', 'wrong-guess'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an email that was never registered, with the same error', async () => {
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nobody@example.com', 'whatever'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
