/// <reference types= "cypress" />>

import {format, prepareLocalStorage} from '../support/Utils'

context('Dev Finances agilizei', () => {

    beforeEach(() => {
        cy.visit('https://maratona-discover-devfinance.netlify.app', { // Acessar a página
            onBeforeLoad: (win) => { // Insere antes de rodar (F12 -  Aplications)
                prepareLocalStorage(win)
            }
        }); 
        //cy.get('#data-table tbody tr').should('have.length', 0); // Verifica se existem 0 elementos na tabela
    });

    it('Cadastrar entradas', () => {

        cy.get('#transactions .button').click(); // Botão Nova transação 
        cy.get('#description').type('Salário'); // Descrição
        cy.get('[name=amount]').type(1000); // Valor
        cy.get('#date').type('2021-04-01'); //data
        cy.get('button').contains('Salvar').click(); // Botão salvar

        cy.get('#data-table tbody tr').should('have.length', 3); // Verifica se existem 1 elementos na tabela

    });

    // Cadastrar saídas
    
    it('Cadastrar saídas', () => {
        
        cy.get('#transactions .button').click(); // Botão Nova transação 
        cy.get('#description').type('Internet'); // Descrição
        cy.get('[name=amount]').type(-80); // Valor
        cy.get('#date').type('2021-04-01'); //data
        cy.get('button').contains('Salvar').click(); // Botão salvar

        cy.get('#data-table tbody tr').should('have.length', 3); // Verifica se existem 1 elementos na tabela
    });

    // Excluir entradas e saídas

    it('Remover entradas/saídas', () => {
        
        
        // Exclui a entrada
        cy.get('td.data-table__description ') // Busca o elemento dentro dos td
        .contains('Mesada')                    // Busca o que contenha o texto
        .parent()                             // Busca nos elementos o pai do elemento anterior  
        .find('img[onclick*=remove]')         // Busca pela img com as propriedades entre parenteses
        .click()                              // Clica
        // Exclui a saída
        cy.get('td.data-table__description ') // Busca o elemento
        .contains('Suco Kapo')                      // Que contenha o texto dentro da variável
        .siblings()                           // Busca os irmãos
        .children('img[onclick*=remove]')     // Que contenha um filho com as características passadas
        .click()                              // Clica

        cy.get('#data-table tbody tr').should('have.length', 0); // Verifica se existem 0 elementos na tabela


    });

    it('Validar saldo com diversas transações', () => {
        
    
        let entradas = 0 
        let saidas = 0

        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => { // Laço/repetição em todos os elementos
                cy.get($el).find('td.data-table__price-income, td.data-table__price-expense') //Pesquisa por um item ou ',' por outro
                  .invoke('text').then(text => {

                        // Verifica se o valor é negativo ou positivo
                        if (text.includes('-')) {
                            saidas = saidas + format(text)
                        }
                        else{
                            entradas = entradas + format(text)
                        }

                  });
        }); 
        
        cy.get('.card__amount').invoke('text').then(text =>{ // Pegando o valor total

            let total_na_tela = format(text) // Valor capturado do total
            let total = entradas + saidas // soma das entradas e saídas

            expect(total_na_tela).to.eq(total) // espera que o valor total seja igual as entradas - saídas
        });
    });
});