import { describe, expect, it } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { restaurants } from './data/restaurants.js';
import { STORAGE_KEY } from './utils/favorites.js';

function goTo(hash) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

describe('Página inicial', () => {
  it('lista todos os restaurantes com espaços de anúncio', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /descubra onde comer/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(restaurants.length);
    expect(screen.getByText(`${restaurants.length} restaurantes encontrados`)).toBeInTheDocument();
    expect(screen.getAllByTestId('ad-slot').length).toBeGreaterThanOrEqual(2);
  });

  it('busca por texto e mostra mensagem quando não há resultados', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Buscar'), 'sushi');
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(1);
    expect(screen.getByText('1 restaurante encontrado')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Buscar'));
    await user.type(screen.getByLabelText('Buscar'), 'xyz-inexistente');
    expect(screen.getByText(/nenhum restaurante encontrado/i)).toBeInTheDocument();
  });

  it('filtra por categoria, bairro, preço e nota, e limpa os filtros', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Categoria'), 'Italiana');
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(2);

    await user.selectOptions(screen.getByLabelText('Preço até'), '2');
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /limpar filtros/i }));
    await user.selectOptions(screen.getByLabelText('Bairro'), 'Centro');
    await user.selectOptions(screen.getByLabelText('Nota mínima'), '4.5');
    const names = screen.getAllByTestId('restaurant-card').map((c) => within(c).getByRole('heading').textContent);
    expect(names).toEqual(expect.arrayContaining(['Fogão da Vó Lurdes', 'Casa do Sultão']));
    expect(names).toHaveLength(2);
  });

  it('ordena por nome', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'name');
    const first = within(screen.getAllByTestId('restaurant-card')[0]).getByRole('heading').textContent;
    expect(first).toBe('Brasa & Cia');
  });
});

describe('Favoritos', () => {
  it('favorita, persiste e exibe na página de favoritos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /adicionar casa do sultão aos favoritos/i }));
    expect(screen.getByRole('link', { name: 'Favoritos (1)' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(['sultao']);

    goTo('#/favoritos');
    expect(screen.getByRole('heading', { name: 'Meus favoritos' })).toBeInTheDocument();
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /remover casa do sultão dos favoritos/i }));
    expect(screen.getByText(/ainda não favoritou/i)).toBeInTheDocument();
  });

  it('carrega favoritos salvos anteriormente', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['cafe-pinhao']));
    render(<App />);
    expect(screen.getByRole('link', { name: 'Favoritos (1)' })).toBeInTheDocument();
  });
});

describe('Navegação', () => {
  it('abre os detalhes de um restaurante e mostra similares', async () => {
    render(<App />);
    goTo('#/restaurante/trattoria-nonna');

    expect(screen.getByRole('heading', { level: 1, name: 'Trattoria della Nonna' })).toBeInTheDocument();
    expect(screen.getByText('Fettuccine ao funghi')).toBeInTheDocument();
    expect(screen.getByText(/Av. dos Imigrantes, 850/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forno de Pedra' })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /adicionar trattoria della nonna/i }));
    expect(screen.getByRole('button', { name: /remover trattoria della nonna/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('mostra detalhe de restaurante patrocinado sem similares', () => {
    const solo = [{ ...restaurants[0], category: 'Única' }];
    render(<App restaurants={solo} />);
    goTo(`#/restaurante/${solo[0].id}`);
    expect(screen.getAllByText('Patrocinado').length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Parecidos' })).not.toBeInTheDocument();
  });

  it('restaurante inexistente mostra aviso', () => {
    render(<App />);
    goTo('#/restaurante/nao-existe');
    expect(screen.getByText('Restaurante não encontrado.')).toBeInTheDocument();
  });

  it('página sobre e rota desconhecida', () => {
    render(<App />);
    goTo('#/sobre');
    expect(screen.getByRole('heading', { name: /sobre o sabor local/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'page');

    goTo('#/rota-que-nao-existe');
    expect(screen.getByText('Página não encontrada.')).toBeInTheDocument();
  });

  it('exibe a versão no rodapé', () => {
    render(<App />);
    expect(screen.getByText(/Sabor Local · v/)).toBeInTheDocument();
  });
});
