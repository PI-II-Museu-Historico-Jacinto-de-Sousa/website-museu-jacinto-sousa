import ToggleLightMode from "../ToggleLightMode"

const mockColorMode = {
    toggleColorMode: () => {

    },
}

const mockMode = 'light'

describe("Testando componente ToggleLightMode", () => {
    it("renderiza corretamente", () => {
        cy.mount(<ToggleLightMode colorMode={mockColorMode} mode={mockMode} data-class-ref='button' />)

        cy.get('button').should('exist')
    }

    )
    it("executa a função ao ser clicado", () => {
        cy.mount(<ToggleLightMode colorMode={mockColorMode} mode={mockMode} data-class-ref='button' />)
        cy.spy(mockColorMode, 'toggleColorMode')

        cy.get('button').click().then(() => {
            expect(mockColorMode.toggleColorMode).to.be.called
        })
    })
}
)