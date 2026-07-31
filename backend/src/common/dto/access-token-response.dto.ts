// Shared response shape for both player and admin login — same fields,
// so one DTO covers both instead of two near-identical copies.
export class AccessTokenResponseDto {
  accessToken: string;
}
