import { FirebaseError } from "firebase/app";
import { HTTPError } from "./HTTPError";

const errorCodeMapping = new Map<string, number>([
  ["not-found", 404],
  ["permission-denied", 403],
  ["already-exists", 409],
]);

export const firebaseErrorToHTTPError = (error: FirebaseError): HTTPError => {
  const status = errorCodeMapping.get(error.code) ?? 500;
  return new HTTPError(status, error.message);
};
