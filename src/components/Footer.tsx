import './Footer.css' 
import telephoneIcon from "../assets/telephone.svg"
import whatsIcon from "../assets/whatsapp.svg"
import emailIcon from "../assets/email.svg"
import addressIcon from "../assets/address.svg"

const Footer = ({telephone, whatsapp, email, address}: {telephone: string, whatsapp: string, email: string, address: string}) => {
    return(
        <>
            <div id="footer-content">
                <li className = 'Footer-item'>
                    <img src={telephoneIcon} alt="" className='Footer-icon'/>
                    {telephone}
                </li>

                <li className = 'Footer-item'>
                    <img src={whatsIcon} alt="" className='Footer-icon'/>
                    {whatsapp}
                </li>

                <li className = 'Footer-item'>
                    <img src={emailIcon} alt="" className='Footer-icon'/>
                    {email}
                </li>

                <li className = 'Footer-item'>
                    <img src={addressIcon} alt="" className='Footer-icon'/>
                    {address}
                </li>
            </div>
        </>
    )
}

export default Footer