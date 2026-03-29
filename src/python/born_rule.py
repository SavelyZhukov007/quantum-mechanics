import numpy as np


def born_probability(basis_state: np.ndarray, psi: np.ndarray) -> float:
    amplitude = np.dot(np.conj(basis_state), psi)
    return abs(amplitude) ** 2


def measure(psi: np.ndarray, basis: list, n_shots: int = 10000) -> dict:
    probs = [born_probability(b, psi) for b in basis]
    probs = np.array(probs) / sum(probs)
    indices = np.random.choice(len(basis), size=n_shots, p=probs)
    counts = {i: int(np.sum(indices == i)) for i in range(len(basis))}
    return counts, probs


H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

psi_list = [
    ("|H⟩", H),
    ("|+45°⟩", np.array([1, 1]) / np.sqrt(2)),
    ("|+30°⟩", np.array([np.cos(np.radians(30)), np.sin(np.radians(30))])),
    ("2|H⟩+i|V⟩", np.array([2, 1j]) / np.sqrt(5)),
]

print("=== Правило Борна:\n\t\t\tP(i) = |⟨vᵢ|ψ⟩|²\n===")
print(f"{'Состояние':18} {'P(H)':10} {'P(V)':10} {'Частота H':12} {'Частота V':12}")
for name, psi in psi_list:
    counts, probs = measure(psi, [H, V], n_shots=100_000)
    total = sum(counts.values())
    freq_H = counts[0] / total
    freq_V = counts[1] / total
    print(f"{name:18} {probs[0]:.6f}  {probs[1]:.6f}  {freq_H:.6f}    {freq_V:.6f}")

print()
print("=== Коллапс состояния после измерения ===")
psi = np.array([1, 1], dtype=complex) / np.sqrt(2)
print(f"Начальное состояние: |+45°⟩ = (|H⟩+|V⟩)/√2")
print(f"P(H) = {born_probability(H, psi):.4f},  P(V) = {born_probability(V, psi):.4f}")
print()
print("После измерения → результат |H⟩:")
psi_after_H = H.copy()
print(f"  Новое состояние: |H⟩")
print(
    f"  P(H) = {born_probability(H, psi_after_H):.4f}  (повторное измерение даст H с P=1)"
)
print(f"  P(V) = {born_probability(V, psi_after_H):.4f}")
print()
print("После измерения → результат |V⟩:")
psi_after_V = V.copy()
print(f"  Новое состояние: |V⟩")
print(f"  P(H) = {born_probability(H, psi_after_V):.4f}")
print(
    f"  P(V) = {born_probability(V, psi_after_V):.4f}  (повторное измерение даст V с P=1)"
)
