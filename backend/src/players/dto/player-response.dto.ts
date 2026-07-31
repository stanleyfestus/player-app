// What a player looks like once it's safe to send to a client — this is
// the sanitize()'d shape from PlayersService, deliberately WITHOUT
// passwordHash. Declaring it as its own class (rather than just letting
// callers return whatever Prisma gives them) is what lets Swagger — and
// therefore the generated frontend types — know the real response shape,
// not just the request shape.
export class PlayerResponseDto {
  id: string;
  fullName: string;
  email: string;
  position: string;
  age?: number;
  club?: string;
  bio?: string;
  videoUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
