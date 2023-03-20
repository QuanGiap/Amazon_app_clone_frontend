import * as React from 'react';
import {nanoid} from 'nanoid'
import {MenuItem,Menu,Button,IconButton} from '@mui/material';

export default function BasicMenu({menu_style={},menu_name,menu_items=[]}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [id_menu, setIdMenu] = React.useState(nanoid());
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menu_items_cmpt = menu_items.map(({onClick,menu_item_name})=><MenuItem key={nanoid()} onClick={()=>{handleClose();onClick();}}>{menu_item_name}</MenuItem>)
  return (
    <div>
      <Button
        {...menu_style}
        id={id_menu+"-button"}
        aria-controls={open ? id_menu+'-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {menu_name}
      </Button>
      <Menu
        id={id_menu+'-menu'}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': id_menu+'-button',
        }}
      >
        {menu_items_cmpt}
      </Menu>
    </div>
  );
}
export function IconMenu({menu_style={},icon,menu_items=[]}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [id_menu, setIdMenu] = React.useState(nanoid());
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const menu_items_cmpt = menu_items.map(({onClick,menu_item_name})=><MenuItem key={nanoid()} onClick={()=>{handleClose();onClick();}}>{menu_item_name}</MenuItem>)
    return (
      <div>
        <IconButton
            {...menu_style}
          id={id_menu+"-button"}
          aria-controls={open ? id_menu+'-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {icon}
        </IconButton>
        <Menu
          id={id_menu+'-menu'}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': id_menu+'-button',
          }}
        >
          {menu_items_cmpt}
        </Menu>
      </div>
    );
  }