import ToggleLightMode from '../ToggleLightMode/ToggleLightMode'
import logo from '../../assets/cityLogo.svg'
import React, { useEffect, useState } from 'react'
import { AppBar, Button, IconButton, Menu, MenuItem, PaletteMode, Theme, Toolbar, Typography, styled, useMediaQuery, useTheme } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { app } from '../../../firebase/firebase'
import { AccountCircle } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'

//Configurations of Menu Desktop

const MenuConfigDesktop = ({label, sectionItem, searchLink, otherLink}: {label: string, sectionItem: string, searchLink: string, otherLink: string}) =>{
    const theme = useTheme()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpen = (event: any) =>{
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () =>{
        setAnchorEl(null)
    }    

    const colorOnOpen = () =>{
        if(anchorEl !== null){
            return {backgroundColor: theme.palette.surface.main, color: theme.palette.primary.main}
        }
    }

    return(
        <>
            <NavRoute onClick={handleOpen} style={colorOnOpen()} >
                <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{label}</Typography>
            </NavRoute>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{onMouseLeave: handleClose}}
                keepMounted
            >
                <Link to={searchLink} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Pesquisar</Typography>
                    </MenuItem>
                </Link>

                <Link to={otherLink} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{sectionItem}</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </>
    )
}

const NavBarDesktop = ({colorMode, mode, logged} : {colorMode: any, mode: PaletteMode, logged: Boolean}) =>{
    return(
        <NavContainer>
            <img src={logo} alt="Prefeitura Municipal de Quixadá" style={{height: '10vh'}}/>

            <NavPages>
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <NavRoute>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Home</Typography>
                    </NavRoute>
                </Link>

                {/* Need to define links to others pages */}
                <MenuConfigDesktop label={'Exposições'} sectionItem={'Criar exposição'} searchLink={'/'} otherLink={'/'}/>

                {/* Need to define links to other pages */}
                <MenuConfigDesktop label={'Acervo'} sectionItem={'Adicionar item'} searchLink={'/'} otherLink={'/acervo/criar-item'}/>

                {/* Need to define links to others pages */}
                <MenuConfigDesktop label={'Editais e normas'} sectionItem={'Cadastrar normativa'} searchLink={'/'} otherLink={'/'}/>
                
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <NavRoute>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Agende uma visita</Typography>
                    </NavRoute>
                </Link>
            </NavPages>
            
            <NavOptions>
                <Option>
                    <ToggleLightMode colorMode={colorMode} mode={mode}/>
                </Option>
                
                {logged ?
                    <MenuLogout/>
                    :
                    ''
                }
            </NavOptions>
        </NavContainer>
    )
}

//Configurations of Menu mobile

const SubMenuConfig = ({label, subItem, searchLink, otherLink}: {label: string, subItem: string, searchLink: string, otherLink: string}) =>{
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClose = () =>{
        setAnchorEl(null)
    }

    const handleOpen = (event: any) =>{
        setAnchorEl(event.currentTarget)
    }

    return(
        <>
            <MenuItem onClick={handleOpen}>
                <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{label}</Typography>
            </MenuItem>

            <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    transformOrigin={{vertical: 'top', horizontal: 'left'}}
                    MenuListProps={{onMouseLeave: handleClose}}
                    keepMounted
                >
                    <Link to={searchLink} style={{textDecoration: 'none', color: 'inherit'}}>
                        <MenuItem onClick={handleClose}>
                            <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Pesquisar</Typography>
                        </MenuItem>
                    </Link>

                    <Link to={otherLink} style={{textDecoration: 'none', color: 'inherit'}}>
                        <MenuItem onClick={handleClose}>
                            <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{subItem}</Typography>
                        </MenuItem>
                    </Link>
            </Menu>
        </>
    )
}

const MenuConfigMobile = () =>{
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpen = (event: any) =>{
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () =>{
        setAnchorEl(null)
    }

    return(
        <>
            <IconButton size='large' onClick={handleOpen}>
                <MenuIcon/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{onMouseLeave: handleClose}}
                keepMounted
            >
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Home</Typography>
                    </MenuItem>
                </Link>

                {/* Need to define links to others pages */}
                <SubMenuConfig label={"Exposições"} subItem={'Criar exposição'} searchLink={'/'} otherLink={'/'}/>

                {/* Need to define links to others pages */}
                <SubMenuConfig label={"Acervo"} subItem={'Adicionar item'} searchLink={'/'} otherLink={'/acervo/criar-item'}/>

                {/* Need to define links to others pages */}
                <SubMenuConfig label={"Editais e normas"} subItem={'Cadastrar normativa'} searchLink={'/'} otherLink={'/'}/>

                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Agende uma visita</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </>
    )
}


const NavBarMobile = ({colorMode, mode, logged} : {colorMode: any, mode: PaletteMode, logged: Boolean}) =>{
    const theme = useTheme()
    
    return(
        <NavContainer>
            <AppBar position='static' sx={{backgroundColor: theme.palette.primary.main}}>
                <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <MenuConfigMobile/>

                    <img src={logo} alt="Prefeitura Municipal de Quixadá" style={{height: '10vh'}}/>

                    <Option>
                        <ToggleLightMode colorMode={colorMode} mode={mode}/>

                        {logged ?
                            <MenuLogout/>
                            :
                            ''
                        }
                    </Option>
                </Toolbar>
            </AppBar>
        </NavContainer>
    )
}

//Menu for logout

const MenuLogout = () =>{
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpen = (event: any) =>{
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () =>{
        setAnchorEl(null)
    }
    return(
        <>
            <IconButton size='large' onClick={handleOpen}>
                <AccountCircle/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{onMouseLeave: handleClose}}
                keepMounted
            >
                {/* Need to define link to other page */}
                <MenuItem onClick={handleClose}>
                    <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Sair</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

const NavBar = ({colorMode, mode} : {colorMode: any, mode: PaletteMode}) =>{
    const theme = useTheme()

    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [logged, setLogged] = useState(false)

    useEffect(() =>{
        const auth = getAuth(app)

        auth.onAuthStateChanged((user) =>{
            setLogged(user ? true : false)
        })
    }, [])

    return(
        <>
            {mobile ? <NavBarMobile colorMode={colorMode} mode={mode} logged={logged}/> : <NavBarDesktop colorMode={colorMode} mode={mode} logged={logged}/>}
        </>
    )
}

const NavContainer = styled('header')(({theme}: {theme: Theme}) =>({
    position: 'absolute',
    fontSize: '2.5vh',
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    background: theme.palette.primary.main,
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
}))

const NavPages = styled('div')(({theme}: {theme: Theme}) =>({
    position: 'absolute',
    width: '70%',
    height: '100%',
    left: '50%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 'var(--space-0, 0px) 40px',
    background: theme.palette.primary.main,
    transform: 'translateX(-50%)',
}))

const NavRoute  = styled(Button)(({theme}: {theme: Theme}) =>({
    cursor: 'pointer',
    color: theme.palette.onSecondary.main,

    '&:hover': {
        backgroundColor: theme.palette.onSecondary.main,
        color: theme.palette.primary.main
    }
}))

const NavOptions = styled('div')(() =>({
    position: 'absolute',
    height: '100%',
    width: '10%',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    listStyle: 'none'
}))

const Option = styled('li')(({theme}: {theme:Theme}) =>({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.palette.onSecondary.main
}))

export default NavBar