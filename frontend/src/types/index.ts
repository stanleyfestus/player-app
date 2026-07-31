// Hand-maintained for now, mirroring the backend's DTOs exactly. Once the
// backend is deployed with Swagger live, run:
//
//   npm run generate-types
//
// (with VITE-side pointing at your backend's /docs-json) to produce
// src/types/api.ts from the real OpenAPI spec, then this file switches to
// re-exporting from there instead of declaring these by hand — so nothing
// that imports from '../types' has to change, only this one file.
//
// Note: createdAt/updatedAt are typed as `string` here, not `Date`. The
// backend's PlayerResponseDto declares them as `Date`, but that's the
// TypeScript type on the server — once it crosses the network as JSON,
// dates arrive as ISO strings. This is exactly the kind of mismatch a
// hand-maintained type file can get wrong; the generated version derives
// it correctly from the OpenAPI schema either way.

export type PlayerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Player {
  id: string;
  fullName: string;
  email: string;
  position: string;
  age?: number;
  club?: string;
  bio?: string;
  videoUrl?: string;
  status: PlayerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerInput {
  fullName: string;
  email: string;
  password: string;
  position: string;
  age?: number;
  club?: string;
  bio?: string;
  videoUrl?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}
