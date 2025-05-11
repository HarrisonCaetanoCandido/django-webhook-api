GENERAL:

manage.py: É o arquivo para gerenciar a aplicação. Este arquivo executa comandos dados pelo terminal.

PROJETO DJANGO:

__init__.py: Transforma um diretório em um pacote.

settings.py: São as configurações do projeto, então temos configuração da BASE_DIR para o processo
principal saber navegar entre as rotas
    - SECRET_KEY: Útil para hash de arquivos;
    - DEBUG: Útil para debugar a aplicação enquanto é executada em dev;
    - ALLOWED_HOSTS: Permitir qual domínio pode executar a aplicação. NADA = localhost;
    - INSTALLED_APPS: São ferramentas instaladas;
    - MIDDLEWARES: Componentes de software entre aplicações para processar requisições;
    - ROOT_URLCONF: Definir o arquivo de rotas base;
    - TEMPLATES: Está relacionado ao frontend na arquitetura MVT do DJANGO;
    - WSGI_APPLICATION: É um padrão de WSGI python;
    - DATABASES: Por padrão DJANGO utiliza o sqlite3, mas é possível configurar outros bancos;
    - AUTH_PASSWORD_VALIDATORS: São validadores de senha por similaridade, tamanho mínimo ou tipo;
    - LANGUAGE_CODE: Qual a linguagem padrão;
    - TIME_ZONE: Fuso horário;
    - STATIC_URL: Diretório de arquivos estáticos, geralmente do frontend.

urls.py: É o arquivo de rotas na aplicação para as views.

wsgl.py: É um arquivo exclusivo para publicação da aplicação e está relacionado a 
configuração da aplicação para deploy

APLICAÇÃO DJANGO:
django-admin startproject project

django-admin startapp core: para iniciar a aplicação

migrations: armazena as migrações/ histórico do banco de dados

__init__: O core é um pacote, logo possui um __init__

admin.py: É o arquivo de configuração de administração da aplicação

app.py: Define o nome da aplicação

models.py: É onde criamos o modelo de dados para o banco de dados

tests.py: Podemos utilizá-lo para criar testes na aplicação

views.py: É aquele que tem funções chamadas nas rotas para abrir templates 
na aplicação ou para executar funções.

pyproject.toml: É um arquivo de configuração padrão para projetos python modernos.
    - Define quais ferramentas são usadas (poetry, black, mypy etc);
    - Define as dependencias do projeto;
    - Define as informações do projeto (nome, versão, autores, etc);
    - Define a build


"""
Utilizar versao especifica do python para rodar o gerenciador de pacotes
"""
poetry env use python3.13 

"""
Rodar no diretorio onde esta o pyproject.toml e poetry.lock.
O comando cria o ambiente virtual do poetry e instala as dependencias 
especificadas em poetry.lock
"""
poetry install 

"""
poetry shell ativa o ambiente virtual do gerenciador de pacotes, ao retornar 
o caminho do ambiente e depois ativar com source
"""
poetry env info --path

source /caminho/retornado/bin/activate

"""
Rodar DJANGO com o poetry
"""
python manage.py runserver

"""
Caso queira rodar DJANGO com o poetry, mas fora do venv 
"""
poetry run python manage.py runserver

"""
Rodar testes ou ferramentas
"""
poetry run pytest

poetry run mypy

O superuser criado é o:
email_pessoal
realmate123