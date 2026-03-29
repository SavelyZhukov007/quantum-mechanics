import numpy as np

H = np.array([1, 0], dtype=complex)
V = np.array([0, 1], dtype=complex)

states = {
    "|H⟩": np.array([1, 0], dtype=complex),
    "|V⟩": np.array([0, 1], dtype=complex),
    "|+45°⟩": np.array([1, 1], dtype=complex) / np.sqrt(2),
    "|-45°⟩": np.array([1, -1], dtype=complex) / np.sqrt(2),
    "|R⟩": np.array([1, 1j], dtype=complex) / np.sqrt(2),
    "|L⟩": np.array([1, -1j], dtype=complex) / np.sqrt(2),
}


def inner_product(a, b):
    return np.dot(np.conj(a), b)


def probability(state_in, basis_state):
    return abs(inner_product(basis_state, state_in)) ** 2


print("=== Таблица поляризационных состояний ===")
print(f"{'Состояние':10} {'|H-компонент|²':16} {'|V-компонент|²':16} {'Сумма':8}")
for name, psi in states.items():
    p_H = probability(psi, H)
    p_V = probability(psi, V)
    print(f"{name:10} {p_H:16.4f} {p_V:16.4f} {p_H+p_V:8.4f}")

print()
print("=== Ортогональность базисных пар ===")
pairs = [("|H⟩", "|V⟩"), ("|+45°⟩", "|-45°⟩"), ("|R⟩", "|L⟩")]
for n1, n2 in pairs:
    ip = inner_product(states[n1], states[n2])
    print(
        f"  ⟨{n1}|{n2}⟩ = {ip:.4f} — {'ортогональны ✓' if abs(ip) < 1e-10 else 'НЕ ортогональны'}"
    )

print()
print("=== Разложение |+30°⟩ по трём базисам ===")
psi = np.array([np.cos(np.radians(30)), np.sin(np.radians(30))], dtype=complex)
for (n1, n2), basis in zip(
    [("|H⟩", "|V⟩"), ("|+45°⟩", "|-45°⟩"), ("|R⟩", "|L⟩")],
    [(H, V), (states["|+45°⟩"], states["|-45°⟩"]), (states["|R⟩"], states["|L⟩"])],
):
    c1, c2 = inner_product(basis[0], psi), inner_product(basis[1], psi)
    ip = inner_product(psi, psi)
    print(
        f"  Базис {{{n1},{n2}}}: |c1|²={abs(c1)**2:.4f}, |c2|²={abs(c2)**2:.4f}, сумма={abs(c1)**2+abs(c2)**2:.4f}"
    )
