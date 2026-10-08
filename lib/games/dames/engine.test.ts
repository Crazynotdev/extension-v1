import { describe, it, expect } from "vitest";
import { initialBoard, legalStepsForSide, applyStep, isGameOver, type Board } from "./engine";

const empty = (): Board => Array.from({ length: 10 }, () => Array(10).fill(0));
const put = (b: Board, r: number, c: number, v: number) => { b[r][c] = v; return b; };
const count = (b: Board, s: 1 | -1) => b.flat().filter((v) => Math.sign(v) === s).length;

describe("plateau initial", () => {
  it("20 pièces par camp, uniquement sur cases sombres", () => {
    const b = initialBoard();
    expect(count(b, 1)).toBe(20);
    expect(count(b, -1)).toBe(20);
    b.forEach((row, r) => row.forEach((v, c) => { if (v !== 0) expect((r + c) % 2).toBe(1); }));
  });
  it("9 coups simples légaux à l'ouverture (10x10)", () => {
    expect(legalStepsForSide(initialBoard(), 1, null).length).toBe(9);
  });
});

describe("déplacements et captures", () => {
  it("un pion ne recule pas en déplacement simple", () => {
    const b = put(empty(), 4, 3, 1);
    expect(legalStepsForSide(b, 1, null).every((s) => s.to.row === 5)).toBe(true);
  });
  it("la prise est obligatoire", () => {
    const b = put(put(put(empty(), 4, 3, 1), 5, 4, -1), 0, 1, 1);
    const steps = legalStepsForSide(b, 1, null);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.every((s) => s.captured)).toBe(true);
  });
  it("le pion capture en arrière", () => {
    const b = put(put(empty(), 4, 3, 1), 3, 4, -1);
    expect(legalStepsForSide(b, 1, null).some((s) => s.captured?.row === 3)).toBe(true);
  });
  it("la dame vole et capture à distance", () => {
    const b = put(put(empty(), 0, 1, 2), 4, 5, -1);
    const caps = legalStepsForSide(b, 1, null);
    expect(caps.length).toBe(4); // atterrit en (5,6) (6,7) (7,8) (8,9)
  });
  it("on ne peut pas sauter sa propre pièce", () => {
    const b = put(put(empty(), 0, 1, 2), 3, 4, 1);
    expect(legalStepsForSide(b, 1, null).filter((s) => s.captured).length).toBe(0);
  });
});

describe("rafles", () => {
  it("la même pièce doit continuer la rafle", () => {
    let b = put(put(put(empty(), 2, 1, 1), 3, 2, -1), 5, 4, -1);
    const first = legalStepsForSide(b, 1, null).find((s) => s.captured?.row === 3)!;
    const r = applyStep(b, first);
    expect(r.continueFrom).toEqual({ row: 4, col: 3 });
    const second = legalStepsForSide(r.board, 1, r.continueFrom!);
    expect(second.length).toBe(1);
    const r2 = applyStep(r.board, second[0]);
    expect(r2.continueFrom).toBeUndefined();
    expect(count(r2.board, -1)).toBe(0);
  });
});

describe("promotion", () => {
  it("un pion qui finit sur la dernière rangée devient dame", () => {
    const b = put(empty(), 8, 1, 1);
    const step = legalStepsForSide(b, 1, null).find((s) => s.to.row === 9)!;
    const r = applyStep(b, step);
    expect(r.board[9][step.to.col]).toBe(2);
    expect(r.promoted).toBe(true);
  });
  it("règle internationale : un pion qui PASSE par la dernière rangée en rafle ne promeut pas", () => {
    // Pion en (7,2) prend (8,3) -> (9,4) puis peut reprendre en arrière (8,5)->(7,6)
    let b = put(put(put(empty(), 7, 2, 1), 8, 3, -1), 8, 5, -1);
    const first = legalStepsForSide(b, 1, null).find((s) => s.captured?.row === 8 && s.captured?.col === 3)!;
    const r = applyStep(b, first);
    expect(r.continueFrom).toEqual({ row: 9, col: 4 });
    expect(r.board[9][4]).toBe(1); // reste un pion tant que la rafle continue
    expect(r.promoted).toBeUndefined();
  });
});

describe("fin de partie", () => {
  it("victoire quand l'adversaire n'a plus de pièce", () => {
    const b = put(empty(), 5, 4, 1);
    expect(isGameOver(b, 1, -1)).toEqual({ over: true, winner: 1 });
  });
  it("victoire quand l'adversaire est bloqué", () => {
    const b = put(put(put(put(empty(), 0, 1, -1), 1, 0, 1), 1, 2, 1), 2, 3, 1);
    // pion -1 en (0,1) : aucune case libre devant, capture impossible (case d'arrivée occupée)
    expect(isGameOver(b, 1, -1).over).toBe(true);
  });
  it("partie en cours sinon", () => {
    expect(isGameOver(initialBoard(), 1, -1).over).toBe(false);
  });
});
