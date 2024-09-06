import { useEffect, useState } from "react"
import { Colecao } from "../../interfaces/Colecao"
import { Theme, styled } from "@mui/material/styles"
import { ItemAcervo } from "../../interfaces/ItemAcervo"
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material"
import useTheme from "@mui/material/styles/useTheme"
import useListItems from "./useListItems"

interface DialogAddItemsProps {
  itensInicias: Map<Colecao, ItemAcervo[]>,
  setItens: (itens: ItemAcervo[]) => void,
  open: boolean
}

const DialogAddItem = ({ itensInicias, setItens, open }: DialogAddItemsProps) =>{
  const theme = useTheme()

  const listItems = useListItems(false)

  const [itensSelecionados, setItensSelecionados] = useState<Map<Colecao, ItemAcervo[]>>(new Map())
  
  const [itensCompletos, setItensCompletos] = useState<Map<Colecao,ItemAcervo[]>>(new Map())

  const handleColectionChecked = (colection: Colecao) =>{
    const items = itensSelecionados.get(colection)
    const isEqual = items?.length === colection.itens?.length

    const newItems = new Map(itensSelecionados)
    newItems.set(colection, isEqual ? [] : [...(itensCompletos.get(colection) || [])])
    
    setItensSelecionados(newItems)
  }

  const handleItemChecked = (colection: Colecao, item: ItemAcervo) =>{
    const itens = itensSelecionados.get(colection) || []
    const index = itens.findIndex(i => i.nome === item.nome)

    const newItems = [...itens]

    if (index !== -1) {
      newItems.splice(index, 1)
    } else {
      newItems.push(item)
    }

    const newSelectItems = new Map(itensSelecionados)

    newSelectItems.set(colection, newItems)

    setItensSelecionados(newSelectItems)
  }

  useEffect(() =>{
    console.log(itensInicias)
    console.log(listItems.data)
    setItensCompletos(listItems.data)
    setItensSelecionados(itensInicias)
  },[listItems.data, listItems.status])

  return(
    <Dialog 
      open={open} 
      aria-labelledby="alert-dialog-title"
      onClose={() => setItens([])}
      PaperProps={{
        style:{
          backgroundColor: `${theme.palette.surfaceContainerHigh.main}`,
          borderRadius: '28px',
          display: 'inline-flex',
          width: '280px',
          maxWidth: '560px',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle
        sx={{display: 'flex', padding: '24px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'stretch'}}
      >
        <Typography 
          variant="headlineSmall"
          color={theme.palette.onSurface.main}>
          Adicionar item à exposição
        </Typography>
        <DialogContentText>
          <Typography
            variant="bodyMedium"
            color={theme.palette.onSurface.main}
          >
            Selecione os itens para adicionar a uma exposição
          </Typography>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <List
          sx={{display: 'flex', maxHeight: '280px', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch'}}
          subheader={<li/>}
        >
          {
            Array.from(itensCompletos .entries()).map(([key, value]: [Colecao, ItemAcervo[]])=>(
              <li key={`Colection ${key.id}`}>
                <ul>
                <ListSubheader
                  sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: `${theme.palette.surfaceContainerHigh.main}`}}
                  >
                  <Typography
                    variant="titleSmall"
                    color={theme.palette.onSurfaceVariant.main}
                    >
                    {key.nome}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    color={theme.palette.onSurfaceVariant.main}
                    >
                    Selecionar todos
                  </Typography>
                  <FormControlLabel 
                    label=""
                    control={
                      <Checkbox 
                        checked={itensSelecionados?.get(key)?.length === itensCompletos?.get(key)?.length}
                        onChange={() => handleColectionChecked(key)}
                      />
                    }
                  />
                  </ListSubheader>
                  {
                    value.map(item =>(
                      <ListItem
                      key={`${item.nome}`}
                      sx={{display: 'flex', alignItems: 'center', alignSelf: 'stretch'}}
                      >
                        <ListItemText primary={item.nome}/>
                        <FormControlLabel
                          label=""
                          control={
                            <Checkbox
                              checked={itensSelecionados?.get(key)?.some(i => i.nome === item.nome)}
                              onChange={() => handleItemChecked(key, item)}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    ))
                  }
                  </ul>
                </li>
            ))
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setItens([])}>
          <Typography
            variant="labelLarge"
            color={theme.palette.inverseSurface.main}
          >
            Cancelar
          </Typography>
        </Button>
        <Button onClick={() => setItens([])}>
        <Typography
            variant="labelLarge"
            color={theme.palette.primary.main}
          >
            Adicionar
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogAddItem