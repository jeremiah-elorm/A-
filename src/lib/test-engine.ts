type SelectOptions<T> = {
  questions: T[];
  count: number;
  seed: number;
};

export function createSeededRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) % 0x100000000;
    return state / 0x100000000;
  };
}

export function selectQuestions<T>({
  questions,
  count,
  seed,
}: SelectOptions<T>) {
  const rng = createSeededRng(seed || 1);
  const pool = [...questions];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}
