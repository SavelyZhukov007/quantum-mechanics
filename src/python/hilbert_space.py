import numpy as np


def inner_product(v1: np.ndarray, v2: np.ndarray) -> complex:
    return np.dot(np.conj(v1), v2)


def norm(v: np.ndarray) -> float:
    return float(np.sqrt(inner_product(v, v).real))


def normalize(v: np.ndarray) -> np.ndarray:
    return v / norm(v)


def are_orthogonal(v1: np.ndarray, v2: np.ndarray, tol: float = 1e-10) -> bool:
    return abs(inner_product(v1, v2)) < tol


H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

cat_alive = H.copy()
cat_dead = V.copy()

superposition = normalize(2 * cat_alive + 1j * cat_dead)

print("=== Постулат гильбертова пространства ===")
print(f"  |H⟩ = {H}")
print(f"  |V⟩ = {V}")
print(f"  |H⟩ и |V⟩ ортогональны: {are_orthogonal(H, V)}")
print(f"  |H⟩ нормирован: {abs(norm(H) - 1) < 1e-10}")
print()

N = 1 / np.sqrt(
    np.dot(np.conj(2 * cat_alive + 1j * cat_dead), 2 * cat_alive + 1j * cat_dead).real
)
psi_schrodinger = N * (2 * cat_alive + 1j * cat_dead)
print("=== Кошка Шрёдингера ===")
print(f"  |ψ⟩ = N·(2|жив⟩ + i|мёртв⟩)")
print(f"  Нормировочный множитель N = {N:.6f}")
print(
    f"  Проверка нормировки ⟨ψ|ψ⟩ = {inner_product(psi_schrodinger, psi_schrodinger).real:.6f}"
)
print()

print("=== Вероятности квантового измерения ===")
pr_alive = abs(inner_product(cat_alive, psi_schrodinger)) ** 2
pr_dead = abs(inner_product(cat_dead, psi_schrodinger)) ** 2
print(f"  P(жив)   = |⟨жив|ψ⟩|² = {pr_alive:.4f}")
print(f"  P(мёртв) = |⟨мёртв|ψ⟩|² = {pr_dead:.4f}")
print(f"  Сумма = {pr_alive + pr_dead:.6f} (должна быть 1.0)")

theta = np.linspace(0, 2 * np.pi, 7, endpoint=False)
print()
print("=== Ортонормальность линейно поляризованных состояний ===")
for i, t1 in enumerate(theta[:3]):
    for j, t2 in enumerate(theta[:3]):
        state1 = np.array([np.cos(t1), np.sin(t1)])
        state2 = np.array([np.cos(t2), np.sin(t2)])
        ip = inner_product(state1, state2)
        print(f"  ⟨{int(np.degrees(t1))}°|{int(np.degrees(t2))}°⟩ = {ip.real:+.4f}")
