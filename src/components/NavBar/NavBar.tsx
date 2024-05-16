import ToggleLightMode from '../ToggleLightMode/ToggleLightMode'
import logo from '../../assets/cityLogo.svg'
import { useEffect, useState } from 'react'
import { AppBar, Button, IconButton, Menu, MenuItem, PaletteMode, Snackbar, Theme, Toolbar, Typography, styled, useMediaQuery, useTheme } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { app } from '../../../firebase/firebase'
import { AccountCircle } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'

//Need to define links to other pages
const pages = [
    {label: "Exposições", sectionItem: "Criar exposição", seacrhLink: "/", otherLink: "/"},
    {label: "Acervo", sectionItem: "Adicionar item", seacrhLink: "/", otherLink: "acervo/criar-item"},
    {label: "Editais e normas", sectionItem: "Cadastrar normativa", seacrhLink: "/", otherLink: "/"},
]

//Configurations of Menu Desktop

const MenuConfigDesktop = ({label, sectionItem, searchLink, otherLink}: {label: string, sectionItem: string, searchLink: string, otherLink: string}) =>{
    const theme = useTheme()

    const [logged, setLogged] = useState(false)

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

    useEffect(() =>{
        const auth = getAuth(app)

        auth.onAuthStateChanged(user =>{
            setLogged(user ? true : false)
        })
    }, [])

    return(
        <>
            {
                logged ?
                <>
                    <NavRoute onClick={handleOpen} style={colorOnOpen()} data-cy={`${label}Option`}>
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
                            <MenuItem onClick={handleClose} data-cy={`search${label}Option`}>
                                <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Pesquisar</Typography>
                            </MenuItem>
                        </Link>

                        <Link to={otherLink} style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem onClick={handleClose} data-cy={`${sectionItem}Option`}>
                                <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{sectionItem}</Typography>
                            </MenuItem>
                        </Link>
                    </Menu>
                </>
                :
                <Link to={searchLink} style={{textDecoration: 'none', color: 'inherit'}} data-cy={`search${label}Option`}>
                    <NavRoute onClick={handleOpen}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{label}</Typography>
                    </NavRoute>
                </Link>
            }
        </>
    )
}

const NavBarDesktop = ({colorMode, mode, logged} : {colorMode: any, mode: PaletteMode, logged: Boolean}) =>{
    const [open, setOpen] = useState(false)

    useEffect(() =>{
        if(logged){
            setOpen(true)
        }
    }, [logged])

    return(
        <NavContainer data-cy="NavContainer">
            <img src={logo} alt="Prefeitura Municipal de Quixadá" style={{height: '10vh'}}/>

            <NavPages>
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}} data-cy="HomeOption">
                    <NavRoute>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Home</Typography>
                    </NavRoute>
                </Link>

                {
                    pages.map(page =>{
                        return(
                            <MenuConfigDesktop 
                                key={page.label}
                                label={page.label} 
                                sectionItem={page.sectionItem}
                                searchLink={page.seacrhLink} 
                                otherLink={page.otherLink}/>                        
                            )
                    })
                }
                
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}} data-cy="VisitOption">
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
                    <Snackbar
                        open={open}
                        autoHideDuration={2000}
                        anchorOrigin={{vertical: "top", horizontal: "center"}}
                        onClose={() => setOpen(false)}
                        message={"Saindo da conta com sucesso"}
                        ContentProps={{
                            sx:{
                                bgcolor: "#388e3c",
                                display: "block",
                                textAlign: "center",
                            }
                        }}
                    ></Snackbar> 
                }
            </NavOptions>
        </NavContainer>
    )
}

//Configurations of Menu mobile

const SubMenuConfig = ({label, subItem, searchLink, otherLink}: {label: string, subItem: string, searchLink: string, otherLink: string}) =>{
    const [anchorEl, setAnchorEl] = useState(null)
    
    const [logged, setLogged] = useState(false)

    const handleClose = () =>{
        setAnchorEl(null)
    }

    const handleOpen = (event: any) =>{
        setAnchorEl(event.currentTarget)
    }

    useEffect(() =>{
        const auth = getAuth(app)

        auth.onAuthStateChanged((user) =>{
            setLogged(user ? true : false)
        })
    }, [])

    return(
        <>
            {
                logged ?
                <>
                    <MenuItem onClick={handleOpen} data-cy={`${label}Option`}>
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
                                <MenuItem onClick={handleClose} data-cy={`search${label}Option`}>
                                    <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Pesquisar</Typography>
                                </MenuItem>
                            </Link>

                            <Link to={otherLink} style={{textDecoration: 'none', color: 'inherit'}}>
                                <MenuItem onClick={handleClose} data-cy={`${subItem}Option`}>
                                    <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{subItem}</Typography>
                                </MenuItem>
                            </Link>
                    </Menu>
                </>
                :
                <Link to={searchLink} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose} data-cy={`search${label}Option`}>
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>{label}</Typography>
                    </MenuItem>
                </Link>
            }
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
            <IconButton size='large' onClick={handleOpen} data-cy="Menu">
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
                    <MenuItem onClick={handleClose} data-cy="HomeOption">
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Home</Typography>
                    </MenuItem>
                </Link>

                {
                    pages.map(page =>{
                        return(
                            <SubMenuConfig
                                key={page.label}
                                label={page.label}
                                subItem={page.sectionItem}
                                searchLink={page.seacrhLink}
                                otherLink={page.otherLink}
                            />
                        )
                    })
                }

                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose} data-cy="VisitOption">
                        <Typography sx={{fontSize: '2vh', fontWeight: 'bold'}}>Agende uma visita</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </>
    )
}


const NavBarMobile = ({colorMode, mode, logged} : {colorMode: any, mode: PaletteMode, logged: Boolean}) =>{
    const theme = useTheme()

    const [open, setOpen] = useState(false)

    useEffect(() =>{
        if(logged){
            setOpen(true)
        }
    }, [logged])
    
    return(
        <NavContainer>
            <AppBar position='static' sx={{backgroundColor: theme.palette.primary.main}}>
                <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <MenuConfigMobile/>

                    <img src={logo} alt="Prefeitura Municipal de Quixadá" style={{height: '10vh'}}/>

                    <Option>
                        <ToggleLightMode colorMode={colorMode} mode={mode}/>

                        {logged ?
                            <MenuLogout />
                            :
                            <Snackbar
                                open={open}
                                autoHideDuration={2000}
                                anchorOrigin={{vertical: "top", horizontal: "center"}}
                                onClose={() => setOpen(false)}
                                message={"Saindo da conta com sucesso"}
                                ContentProps={{
                                    sx:{
                                        bgcolor: "#388e3c",
                                        display: "block",
                                        textAlign: "center",
                                    }
                                }}
                            ></Snackbar> 
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

    useEffect

    const LogOut = () =>{
        const auth = getAuth(app)

        auth.signOut().then().
        catch(error =>{
            console.log(error)
        })
    }

    return(
        <>
            <IconButton size='large' onClick={handleOpen} data-cy="User">
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
                <MenuItem onClick={LogOut} data-cy="LogOutOption">
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