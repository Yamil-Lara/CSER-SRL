# CSER

### C → Compilando 
### S → Sueños 
### E → Ejecutando 
### R → Realidades

---

### Estructura del Proyecto

```
CSER-S.R.L./
├── .git/
│
├── backend/          # Lógica, API, base de datos (Node, Python, etc.)
│   ├── src/
│   ├── package.json  # Dependencias del backend
│   └── .env
│
├── frontend/         # Interfaz de usuario (React, Vue, Angular, etc.)
│   ├── src/
│   ├── package.json  # Dependencias del frontend
│   └── .env
│
├── .gitignore        # Ignorar node_modules de ambos
├── README.md
└── package.json      # Opcional: Scripts para iniciar ambos (concurrently)
```