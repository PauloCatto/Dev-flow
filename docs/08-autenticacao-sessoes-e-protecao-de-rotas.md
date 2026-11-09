# Módulo 08: Autenticação, Sessões HTTP-Only e Proteção de Rotas

Neste módulo, implementamos o fluxo completo de **Autenticação Full-Stack** no **DevFlow** utilizando o banco **SQLite (Prisma ORM)**, **Server Actions** com `useActionState` do React 19 e **Cookies HTTP-Only** assinados com HMAC-SHA256.

---

## 1. Arquitetura de Segurança (`lib/auth.ts` e `app/actions/auth.ts`)

1. **Hashing de Senhas (`scryptSync` + Salt Aleatório):**
   As senhas nunca são salvas em texto puro no banco SQLite. Cada senha recebe um `salt` criptográfico único de 16 bytes e é derivada com `scrypt` (64 bytes), verificada com `timingSafeEqual` para prevenir *timing attacks*.
2. **Sessão Stateless Assinada (`HMAC-SHA256` em Cookie `httpOnly`):**
   Ao autenticar em `/login` ou `/register`, o servidor gera um token assinado contendo `{ id, name, email, role, exp }` e grava no cookie `devflow_session` com `httpOnly: true` (inacessível via JavaScript no navegador contra XSS).
3. **Proteção de Rotas no Layout (`app/(dashboard)/layout.tsx`):**
   O Server Component verifica `await getCurrentUser()`. Se não houver sessão válida, executa `redirect("/login")` antes de renderizar qualquer rota interna (`/dashboard`, `/projects`, `/tasks`, `/kanban`, `/settings`).

---

## 2. Comparação Direta: Angular vs Next.js (App Router)

| Conceito | Angular | Next.js 16 (App Router) |
| :--- | :--- | :--- |
| **Proteção de Rotas** | `CanActivateFn` (`AuthGuard`) no Router | Verificação no Server Layout (`await getCurrentUser()` + `redirect('/login')`) |
| **Armazenamento de Token** | `localStorage` ou Cookie via `HttpInterceptor` | Cookie `httpOnly` lido diretamente no servidor via `await cookies()` |
| **Envio de Formulário de Login** | `ReactiveFormsModule` + `AuthService.login().subscribe()` | `<form action={action}>` + `useActionState(loginAction, undefined)` |

