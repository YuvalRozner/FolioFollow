import { DEFAULT_LANGUAGE } from '../shared/constants';
import { User, UserRole } from '../shared/types';
import { collections } from './baseService';
import { nowIso } from '../utils/date';
import { notFound } from '../utils/errors';

export class UserService {
  async ensureUserProfile(params: { uid: string; email?: string; name?: string; picture?: string }): Promise<User> {
    const ref = collections.users().doc(params.uid);
    const snapshot = await ref.get();
    const now = nowIso();

    if (!snapshot.exists) {
      // First user in the system automatically becomes admin
      const allUsers = await collections.users().limit(1).get();
      const isFirstUser = allUsers.empty;

      const newUser: User = {
        id: params.uid,
        email: params.email ?? '',
        displayName: params.name ?? params.email ?? 'User',
        photoURL: params.picture,
        role: isFirstUser ? UserRole.ADMIN : UserRole.USER,
        language: DEFAULT_LANGUAGE,
        createdAt: now,
        updatedAt: now,
      };

      await ref.set(newUser);
      console.log(`New user created: ${params.email} (role: ${newUser.role}${isFirstUser ? ' — first user, granted admin' : ''})`);
      return newUser;
    }

    const existing = snapshot.data() as User;
    const updates: Partial<User> = {};
    if (params.email && existing.email !== params.email) updates.email = params.email;
    if (params.name && existing.displayName !== params.name) updates.displayName = params.name;
    if (params.picture && existing.photoURL !== params.picture) updates.photoURL = params.picture;

    // Auto-promote: if this is the only user in the system and not yet admin, promote them
    if (existing.role !== UserRole.ADMIN) {
      const allUsers = await collections.users().limit(2).get();
      if (allUsers.size === 1) {
        updates.role = UserRole.ADMIN;
        console.log(`Auto-promoted ${params.email} to admin (only user in system)`);
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = now;
      await ref.set(updates, { merge: true });
    }

    return { ...existing, ...updates, id: params.uid };
  }

  async getUserById(userId: string): Promise<User> {
    const snapshot = await collections.users().doc(userId).get();
    if (!snapshot.exists) throw notFound('User not found');
    return snapshot.data() as User;
  }

  async updateLanguage(userId: string, language: 'he' | 'en'): Promise<User> {
    const ref = collections.users().doc(userId);
    await ref.set({ language, updatedAt: nowIso() }, { merge: true });
    return this.getUserById(userId);
  }

  async listUsers(): Promise<User[]> {
    const snapshot = await collections.users().orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as User), id: doc.id }));
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    const ref = collections.users().doc(userId);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw notFound('User not found');
    await ref.set({ role, updatedAt: nowIso() }, { merge: true });
    return this.getUserById(userId);
  }
}

export const userService = new UserService();
