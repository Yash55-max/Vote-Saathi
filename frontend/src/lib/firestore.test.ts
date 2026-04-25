import { getUserInteractions } from '@/lib/firestore';

const { queryMock, limitMock } = vi.hoisted(() => ({
  queryMock: vi.fn((...args) => ({ __query: args })),
  limitMock: vi.fn((n: number) => ({ __limit: n })),
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn((...args) => ({ __collection: args })),
  addDoc: vi.fn(),
  query: queryMock,
  where: vi.fn((...args) => ({ __where: args })),
  orderBy: vi.fn((...args) => ({ __orderBy: args })),
  limit: limitMock,
  getDocs: vi.fn(async () => ({ docs: [] })),
  serverTimestamp: vi.fn(),
}));

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clamps interaction query limit to maximum 50', async () => {
    await getUserInteractions('user-1', 999);
    expect(limitMock).toHaveBeenCalledWith(50);
  });

  it('clamps interaction query limit to minimum 1', async () => {
    await getUserInteractions('user-1', 0);
    expect(limitMock).toHaveBeenCalledWith(1);
  });
});
