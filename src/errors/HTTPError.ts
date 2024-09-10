export class HTTPError extends Error {
  status: number;
  constructor(status?: number, message?: string) {
    super(message || "Um erro inesperado ocorreu");
    this.status = status || 500;
  }
}
