const API_PRODUTOS = 'http://localhost:3000/produtos';
const API_LIVRO = 'http://localhost:3000/livro';

const tabProdutos = document.getElementById('tab-produtos');
const tabLivros = document.getElementById('tab-livros');
const paneProdutos = document.getElementById('produtos-pane');
const paneLivros = document.getElementById('livros-pane');

const formProduto = document.getElementById('form-produto');
const produtoId = document.getElementById('produto-id');
const produtoNome = document.getElementById('produto-nome');
const produtoPreco = document.getElementById('produto-preco');
const produtoEstoque = document.getElementById('produto-estoque');
const btnCancelarProduto = document.getElementById('btn-cancelar-produto');
const tbodyProdutos = document.querySelector('#tabela-produtos tbody');

const formLivro = document.getElementById('form-livro');
const livroId = document.getElementById('livro-id');
const livroNome = document.getElementById('livro-nome');
const livroPreco = document.getElementById('livro-preco');
const livroEstoque = document.getElementById('livro-estoque');
const btnCancelarLivro = document.getElementById('btn-cancelar-livro');
const tbodyLivros = document.querySelector('#tabela-livros tbody');

function selecionarAba(aba) {
  const active = aba === 'produtos';
  tabProdutos.classList.toggle('active', active);
  tabLivros.classList.toggle('active', !active);
  paneProdutos.classList.toggle('active', active);
  paneLivros.classList.toggle('active', !active);
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function criarBotao(rotulo, classe, id) {
  const botao = document.createElement('button');
  botao.textContent = rotulo;
  botao.type = 'button';
  botao.className = classe;
  botao.dataset.id = id;
  return botao;
}

function formatarPreco(valor) {
  return `R$ ${Number(valor).toFixed(2)}`;
}

async function listarProdutos() {
  const resposta = await fetch(API_PRODUTOS);
  const produtos = await resposta.json();

  tbodyProdutos.replaceChildren();
  produtos.forEach((item) => {
    const tr = document.createElement('tr');
    tr.append(
      criarCelula(item.id),
      criarCelula(item.nome),
      criarCelula(formatarPreco(item.preco)),
      criarCelula(item.estoque),
    );

    const tdAcoes = document.createElement('td');
    tdAcoes.append(
      criarBotao('Editar', 'btn-editar', item.id),
      criarBotao('Excluir', 'btn-excluir', item.id),
    );
    tr.append(tdAcoes);
    tbodyProdutos.append(tr);
  });
}

async function listarLivros() {
  const resposta = await fetch(API_LIVRO);
  const livros = await resposta.json();

  tbodyLivros.replaceChildren();
  livros.forEach((item) => {
    const tr = document.createElement('tr');
    tr.append(
      criarCelula(item.id),
      criarCelula(item.nome),
      criarCelula(formatarPreco(item.preco)),
      criarCelula(item.estoque),
    );

    const tdAcoes = document.createElement('td');
    tdAcoes.append(
      criarBotao('Editar', 'btn-editar', item.id),
      criarBotao('Excluir', 'btn-excluir', item.id),
    );
    tr.append(tdAcoes);
    tbodyLivros.append(tr);
  });
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const dados = {
    nome: produtoNome.value,
    preco: parseFloat(produtoPreco.value),
    estoque: parseInt(produtoEstoque.value, 10),
  };

  const id = produtoId.value;
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_PRODUTOS}/${id}` : API_PRODUTOS;

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  resetarFormularioProduto();
  listarProdutos();
}

async function salvarLivro(evento) {
  evento.preventDefault();

  const dados = {
    nome: livroNome.value,
    preco: parseFloat(livroPreco.value),
    estoque: parseInt(livroEstoque.value, 10),
  };

  const id = livroId.value;
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_LIVRO}/${id}` : API_LIVRO;

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  resetarFormularioLivro();
  listarLivros();
}

async function editarProduto(id) {
  const resposta = await fetch(`${API_PRODUTOS}/${id}`);
  const item = await resposta.json();

  produtoId.value = item.id;
  produtoNome.value = item.nome;
  produtoPreco.value = item.preco;
  produtoEstoque.value = item.estoque;
  btnCancelarProduto.hidden = false;
  selecionarAba('produtos');
}

async function editarLivro(id) {
  const resposta = await fetch(`${API_LIVRO}/${id}`);
  const item = await resposta.json();

  livroId.value = item.id;
  livroNome.value = item.nome;
  livroPreco.value = item.preco;
  livroEstoque.value = item.estoque;
  btnCancelarLivro.hidden = false;
  selecionarAba('livros');
}

async function excluirProduto(id) {
  if (!confirm('Deseja excluir este produto?')) return;
  await fetch(`${API_PRODUTOS}/${id}`, { method: 'DELETE' });
  listarProdutos();
}

async function excluirLivro(id) {
  if (!confirm('Deseja excluir este livro?')) return;
  await fetch(`${API_LIVRO}/${id}`, { method: 'DELETE' });
  listarLivros();
}

function resetarFormularioProduto() {
  formProduto.reset();
  produtoId.value = '';
  produtoEstoque.value = '0';
  btnCancelarProduto.hidden = true;
}

function resetarFormularioLivro() {
  formLivro.reset();
  livroId.value = '';
  livroEstoque.value = '0';
  btnCancelarLivro.hidden = true;
}

tabProdutos.addEventListener('click', () => selecionarAba('produtos'));
tabLivros.addEventListener('click', () => selecionarAba('livros'));

formProduto.addEventListener('submit', salvarProduto);
btnCancelarProduto.addEventListener('click', resetarFormularioProduto);

formLivro.addEventListener('submit', salvarLivro);
btnCancelarLivro.addEventListener('click', resetarFormularioLivro);

tbodyProdutos.addEventListener('click', (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;

  if (evento.target.classList.contains('btn-editar')) {
    editarProduto(id);
  }
  if (evento.target.classList.contains('btn-excluir')) {
    excluirProduto(id);
  }
});

tbodyLivros.addEventListener('click', (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;

  if (evento.target.classList.contains('btn-editar')) {
    editarLivro(id);
  }
  if (evento.target.classList.contains('btn-excluir')) {
    excluirLivro(id);
  }
});

selecionarAba('produtos');
listarProdutos();
listarLivros();
