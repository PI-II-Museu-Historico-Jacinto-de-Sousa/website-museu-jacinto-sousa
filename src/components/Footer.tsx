import telephoneIcon from "../assets/telephone.svg"
import whatsIcon from "../assets/whatsapp.svg"
import emailIcon from "../assets/email.svg"
import addressIcon from "../assets/address.svg"
import { styled } from '@mui/material'

const FooterContainer = styled('div')`
    position: absolute;
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateX(-50%);
    bottom: 0;
`
const FooterContent = styled('div')`
    position: relative;
    top: 0;
    display: flex;
    width: 100%;
    height: 9%;
    justify-content: space-around;
    align-items: center;
    flex-shrink: 0;
    background: var(--Schemes-Outline, #85736C);
`

const FooterItem = styled('li')`
    list-style-type: none;
    font-size: 2.5vh;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 1.5vh;
`

const FooterIcon = styled('img')`
    position: relative;
    margin-right: 1vw;
`

const FooterEditable = styled('div')`
    position: relative;
    width: 100%;
    height: 10%;
    bottom: 0;
    background: var(--Schemes-Outline, #85736C);
`

const Footer = ({telephone, whatsapp, email, address, editable}: {telephone: string, whatsapp: string, email: string, address: string, editable: boolean}) => {
    return(
        <>
            <FooterContainer>
                <FooterContent style={{}}>
                    <FooterItem>
                        <FooterIcon src={telephoneIcon}/>
                        {telephone}
                    </FooterItem>

                    <FooterItem>
                        <FooterIcon src={whatsIcon}/>
                        {whatsapp}
                    </FooterItem>

                    <FooterItem>
                        <FooterIcon src={emailIcon}/>
                        {email}
                    </FooterItem>

                    <FooterItem>
                        <FooterIcon src={addressIcon}/>
                        {address}
                    </FooterItem>
                </FooterContent>

                {
                    editable === true ?

                    <FooterEditable>
                        <strong style={{cursor: "pointer"}}>(Editar)</strong>
                    </FooterEditable>

                    :

                    <></>
                }

            </FooterContainer>
        </>
    )
}

export default Footer