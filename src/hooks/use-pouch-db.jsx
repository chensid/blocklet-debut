import sha256 from 'crypto-js/sha256';
import { nanoid } from 'nanoid';
import PouchDB from 'pouchdb';
import pouchdbFind from 'pouchdb-find';
import { createContext, useContext, useEffect, useMemo } from 'react';

PouchDB.plugin(pouchdbFind);
const PouchDBContext = createContext();

function PouchDBProvider({ children }) {
  const db = useMemo(() => {
    try {
      return new PouchDB('blocklet-debut');
    } catch (error) {
      console.error('Failed to initialize PouchDB:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    async function initializeData() {
      if (db) {
        try {
          // 检查数据是否为空
          const result = await db.allDocs();
          if (result.total_rows === 0) {
            const id = nanoid();
            const initialData = {
              _id: id,
              type: 'user',
              email: 'demo@example.com',
              username: 'demo',
              password: sha256('password').toString(),
              phone: '18888888888',
              gender: 'male',
              address: '北京市海淀区',
              bio: '这是一个测试用户',
            };
            await db.put(initialData);
          }
        } catch (error) {
          console.error('Failed to initialize data:', error);
        }
      }
    }
    initializeData();
  }, [db]);
  return <PouchDBContext.Provider value={db}>{children}</PouchDBContext.Provider>;
}

const usePouchDB = () => {
  const context = useContext(PouchDBContext);
  if (context === undefined) {
    throw new Error('usePouchDB must be used within a PouchDBProvider');
  }
  return context;
};

export { PouchDBProvider, usePouchDB };
