export const ZONES = Array.from({ length: 25 }).map((_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;

  return {
    id: i,
    name: `Zone ${i}`,
    x: 100 + col * 130,
    y: 100 + row * 110,
  };
});