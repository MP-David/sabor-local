export default function Footer({ version }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Sabor Local · v{version} · Dados fictícios para fins acadêmicos (trabalho de Integração Contínua).
        </p>
      </div>
    </footer>
  );
}
