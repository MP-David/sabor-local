# Política de segurança

- Nenhuma credencial é versionada. Tokens (ex.: `SONAR_TOKEN`) ficam em **GitHub Secrets**.
- O pipeline executa `npm audit`, `npm audit signatures`, Dependency Review, Gitleaks e CodeQL a cada push/PR.
- O Dependabot abre PRs semanais de atualização para npm, GitHub Actions e Docker.

Encontrou uma vulnerabilidade? Abra uma issue privada em **Security → Report a vulnerability**.
