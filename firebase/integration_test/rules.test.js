/* eslint-disable no-undef */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes } from "firebase/storage";
import * as fs from "fs";

const testEnv = await initializeTestEnvironment({
  projectId: "demo-project",
  firestore: {
    host: "127.0.0.1",
    port: 8080,
    rules: fs.readFileSync("../../firestore.rules", "utf8"),
  },
  storage: {
    host: "127.0.0.1",
    port: 9199,
    rules: fs.readFileSync("../../storage.rules", "utf8"),
  },
});

const testUser = testEnv.authenticatedContext("user");

const authenticatedCollection = collection(
  testUser.firestore(),
  "authenticated"
);
const unauthenticatedCollection = collection(
  testEnv.unauthenticatedContext().firestore(),
  "unauthenticated"
);

const authenticatedContextDocs = {
  privateDoc: doc(authenticatedCollection, "privateItem"),
  publicDoc: doc(authenticatedCollection, "publicItem"),
};

const unauthenticatedContextDocs = {
  privateDoc: doc(unauthenticatedCollection, "privateItem"),
  publicDoc: doc(unauthenticatedCollection, "publicItem"),
};

describe("Testando regras de segurança do firestore e storage", () => {
  describe("Testando regras de segurança do firestore no contexto autenticado", () => {
    before(async () => {
      await assertSucceeds(
        setDoc(authenticatedContextDocs.privateDoc, { privado: true })
      );
      await assertSucceeds(
        setDoc(authenticatedContextDocs.publicDoc, { privado: false })
      );
    });
    it("Deve permitir inserção de documentos públicos e privados", async () => {
      const newPrivateDoc = { privado: true, updated: true };
      const newPublicDoc = { privado: false, updated: true };
      await assertSucceeds(addDoc(authenticatedCollection, newPrivateDoc));
      await assertSucceeds(addDoc(authenticatedCollection, newPublicDoc));
    });
    it("Deve permitir leitura de documentos públicos e privados", async () => {
      await assertSucceeds(getDoc(authenticatedContextDocs.privateDoc));
      await assertSucceeds(getDoc(authenticatedContextDocs.publicDoc));
    });
    it("Deve permitir atualização de documentos públicos e privados", async () => {
      await assertSucceeds(
        updateDoc(authenticatedContextDocs.privateDoc, {
          privado: true,
          updated: true,
        })
      );
      await assertSucceeds(
        updateDoc(authenticatedContextDocs.publicDoc, {
          privado: false,
          updated: true,
        })
      );
    });
    it("Deve permitir remoção de documentos públicos e privados", async () => {
      await assertSucceeds(deleteDoc(authenticatedContextDocs.privateDoc));
      await assertSucceeds(deleteDoc(authenticatedContextDocs.publicDoc));
    });
  });

  describe("Testando regras de segurança do firebase no contexto não autenticado", () => {
    before(async () => {
      await testEnv.withSecurityRulesDisabled(async () => {
        // Adicionando documentos no contexto nao autenticado ignorando as regras de seguranca
        setDoc(unauthenticatedContextDocs.privateDoc, { privado: true });
        setDoc(unauthenticatedContextDocs.publicDoc, { privado: false });
      });
    });
    it("Deve proibir inserção no contexto não autenticado", async () => {
      await assertFails(
        setDoc(unauthenticatedContextDocs.privateDoc, { privado: true })
      );
      await assertFails(
        setDoc(unauthenticatedContextDocs.publicDoc, { privado: false })
      );
    });
    it("Deve proibir leitura de documentos privados", async () => {
      await assertFails(getDoc(unauthenticatedContextDocs.privateDoc));
    });
  });

  describe("Testando regras de segurança do storage", () => {
    it("Deve permitir upload de arquivos no contexto autenticado", async () => {
      const storageRef = ref(testUser.storage(), "file.txt");
      await assertSucceeds(uploadBytes(storageRef, new ArrayBuffer(4)));
    });
    it("Deve proibir upload de arquivos no contexto não autenticado", async () => {
      const storageRef = ref(
        testEnv.unauthenticatedContext().storage(),
        "file.txt"
      );
      await assertFails(uploadBytes(storageRef, new ArrayBuffer(4)));
    });
  });

  after(async () => {
    testEnv.cleanup();
  });
});
