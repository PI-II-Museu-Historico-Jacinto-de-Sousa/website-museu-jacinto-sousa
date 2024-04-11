import './NavBar.css'
import ToggleLightMode from './ToggleLightMode'
import userIcon from '../assets/user.svg'
import logo from '../assets/cityLogo.svg'
import { useState } from 'react'

const NavBar = ({colorMode, mode, login} : {colorMode: any, mode: string, login: boolean}) =>{
    const [colorRoute, setColorRoute] = useState(1)

    function colorSwitcher(actualID: number, colorRoute: number): string{
        if (actualID === colorRoute){
            return "yellow"
        }
        return ""
    }

    return(
        <>
            <div id="nav-container">
                <img src={logo} alt="" />

                <div id='nav-pages'>
                    <li className='Nav-route' onClick={() => setColorRoute(1)} style={{color: colorSwitcher(1, colorRoute)}}>
                        <strong>Home</strong>
                    </li>
                    <li className='Nav-route' onClick={() => setColorRoute(2)} style={{color: colorSwitcher(2, colorRoute)}}>
                        <strong>Exposições</strong>
                    </li>
                    <li className='Nav-route' onClick={() => setColorRoute(3)} style={{color: colorSwitcher(3, colorRoute)}}>
                        <strong>Acervo</strong>
                    </li>
                    <li className='Nav-route' onClick={() => setColorRoute(4)} style={{color: colorSwitcher(4, colorRoute)}}>
                        <strong>Editais e Normas</strong>
                    </li>
                </div>
                
                <div id="nav-options">
                    <li className='Option'>
                        <ToggleLightMode colorMode={colorMode} mode={mode}/>
                    </li>
                    
                    {login === true ?
                        <>
                            <img src={userIcon} alt="" style={{cursor: "pointer", position: "relative"}}/>
                            
                            <li className='Option'>
                                <strong>User</strong>
                            </li>
                        </>
                        :
                        <></>
                    }

                </div>
            </div>
        </>
    )
}

export default NavBar