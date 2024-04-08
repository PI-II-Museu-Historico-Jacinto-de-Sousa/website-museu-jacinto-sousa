
const Footer = ({telephone, whatsapp, email, address}: {telephone: string, whatsapp: string, email: string, address: string}) => {
    return(
        <>
            <div id="footer-content">
                <li>{telephone}</li>
                <li>{whatsapp}</li>
                <li>{email}</li>
                <li>{address}</li>
            </div>
        </>
    )
}

export default Footer