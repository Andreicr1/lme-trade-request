# LME Trade Request Generator

Sistema customizado para geração de instruções de trades com múltiplas pernas (legs) no padrão institucional da LME (London Metal Exchange), incluindo lógica de preços fixos, médios (AVG) e estruturações complexas como Fix-to-AVG, C2R e AVG Parcial.

---

## 🎯 Objetivo

Permitir ao usuário estruturar, validar e copiar instruções de trade complexas entre duas pernas (Leg 1 e Leg 2), com regras automáticas que respeitam:

- Formato europeu de data (`dd-mm-yy`)
- Regras de negócios da LME (como PPT em D+2 úteis ou segundo dia útil do mês)
- Lógicas sincronizadas de quantidade, tipo de preço e data
- Campos dinâmicos que abrem conforme o tipo de preço selecionado

---

## 🚀 Tecnologias Utilizadas

- **JavaScript Vanilla** para lógica de frontend
- **Tailwind CSS** para estilo responsivo
- **Calendário Lunar Solar (solarlunar.js)** para suporte adicional de datas (chinês/lunar, opcional)
- **Service Worker (opcional)** para suporte offline
- **HTML5** estruturado com `template` e elementos dinâmicos

---

## 🧠 Funcionalidades

- [x] Geração automática de requests padrão LME
- [x] Identificação de tipo de preço por perna (Fix, AVG, C2R)
- [x] AVG Mensal e AVG Parcial com cálculo automático do PPT
- [x] Datas válidas com feriados do Reino Unido via API
- [x] Output consolidado de múltiplos trades
- [x] Copy to clipboard com botão dedicado
- [x] Controle de erros e validações amigáveis

---

## 🗂️ Estrutura de Diretórios

lme-trade-request/
├── public/
│ ├── index.html # HTML principal com template
│ ├── tailwind.min.css # Estilo
│ ├── solarlunar.min.js # Biblioteca de calendário (JS)
├── src/
│ ├── assets/
│ │ ├── script.js # Toda a lógica do trade
│ ├── logic/
│ │ └── tradeLogic.js # Lógica separada de PPTs, holidays etc
│ ├── tests/
│ │ └── tradeLogic.test.js # Testes unitários (opcional)
├── calendar-utils.js # Formatação de data (gregoriano e lunar)
├── service-worker.js # Suporte PWA (opcional)
├── package.json
├── README.md

---

## 🛠️ Como usar

1. Clone o projeto:
   ```bash
   git clone https://github.com/seu-usuario/lme-trade-request.git
   cd lme-trade-request

Instale dependências (se houver):

bash
Copiar
Editar
npm install
Abra public/index.html no navegador:

bash
Copiar
Editar
open public/index.html
Adicione trades, defina parâmetros, clique em Generate e use o botão Copy All para colar no sistema da corretora ou mesa de operações.

📌 Observações
Campo de Fixing Date aceita qualquer data válida no calendário.

O botão "Use AVG PPT Date" na Leg 2 permite sincronizar datas com AVG da Leg 1.

Estrutura segue o padrão:
Buy 50 mt Al AVG September 2025 Flat ppt 03-09-25 and Sell 50 mt Al Fix ppt 06-09-25 against

🤝 Contribuição
Contribuições são bem-vindas, desde que respeitem o padrão institucional da LME e mantenham a integridade do fluxo lógico do projeto.

🔒 Licença
Uso restrito à equipe proprietária. Consulte o responsável técnico para compartilhamento externo.git add .