import numpy as np
import matplotlib.pyplot as plt

hbar = 1.0545718e-34

sigma_x_vals = np.logspace(-20, 0, 500)
sigma_p_min = hbar / (2 * sigma_x_vals)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor("#0a0a0f")
for ax in axes:
    ax.set_facecolor("#0f0f1a")

axes[0].loglog(sigma_x_vals, sigma_p_min, color="#7b8cff", linewidth=2)
axes[0].axvline(1e-10, color="#4dffb0", linestyle="--", alpha=0.7, label="Атом (~1Å)")
axes[0].axvline(
    1e-30, color="#ff6b6b", linestyle="--", alpha=0.7, label="Электрон (~1e-30 м)"
)
axes[0].set_xlabel("σ_x (м)", color="#8888aa")
axes[0].set_ylabel("σ_p минимальная (кг·м/с)", color="#8888aa")
axes[0].set_title("Принцип неопределённости Гейзенберга", color="#e8e8f0")
axes[0].legend(facecolor="#13131f", edgecolor="#333", labelcolor="#e8e8f0")
axes[0].tick_params(colors="#8888aa")
axes[0].grid(True, alpha=0.15)

m_macro = 1.0
m_electron = 9.109e-31
sigma_x = np.logspace(-35, 0, 500)
sigma_p_macro = hbar / (2 * sigma_x)
sigma_v_macro = sigma_p_macro / m_macro
sigma_v_electron = sigma_p_macro / m_electron

axes[1].loglog(
    sigma_x, sigma_v_macro, color="#b06fff", linewidth=2, label="Макрообъект (1 кг)"
)
axes[1].loglog(
    sigma_x, sigma_v_electron, color="#4dd9ff", linewidth=2, label="Электрон"
)
axes[1].axhline(
    1e-17, color="#e0c87a", linestyle=":", alpha=0.7, label="Предел измерений"
)
axes[1].set_xlabel("σ_x (м)", color="#8888aa")
axes[1].set_ylabel("σ_v минимальная (м/с)", color="#8888aa")
axes[1].set_title("Неопределённость скорости vs координаты", color="#e8e8f0")
axes[1].legend(facecolor="#13131f", edgecolor="#333", labelcolor="#e8e8f0")
axes[1].tick_params(colors="#8888aa")
axes[1].grid(True, alpha=0.15)

plt.tight_layout()
plt.savefig("heisenberg.png", dpi=150, bbox_inches="tight", facecolor="#0a0a0f")
plt.show()

sigma_x_macro = 1e-17
sigma_p_macro_val = hbar / (2 * sigma_x_macro)
sigma_v_macro_val = sigma_p_macro_val / 1.0

sigma_x_electron = 1e-10
sigma_p_electron = hbar / (2 * sigma_x_electron)
sigma_v_electron_val = sigma_p_electron / m_electron

print(f"Макрообъект: σ_x={sigma_x_macro:.0e} м → σ_v={sigma_v_macro_val:.2e} м/с")
print(f"Электрон:    σ_x={sigma_x_electron:.0e} м → σ_v={sigma_v_electron_val:.2e} м/с")
print(f"σ_x·σ_p = ℏ/2 = {hbar/2:.3e} Дж·с ✓")
