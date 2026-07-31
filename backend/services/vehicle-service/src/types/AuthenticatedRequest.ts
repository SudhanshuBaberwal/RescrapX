interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}