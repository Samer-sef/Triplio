import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, DialogContent, DialogTitle, IconButton, Box } from "@mui/material";

import { useNavigate } from 'react-router-dom'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    overflowY: 'auto',
    maxHeight: '80vh',
    maxWidth: '70vh',
    boxShadow: 20,
    p: 4,
    borderRadius: 3,
};

export default function BasicModal({Content, title}) {
    
  const closeModal = () => setOpen(false);
  const navigate = useNavigate();
  const handleClose = () => {
    closeModal()
    navigate('/')
  }

    return (
        <Modal
            open={true}
            onClose={handleClose}
            disableRestoreFocus
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            
            <Box sx={style}>
            
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    {title}
                    <IconButton sx={{ ml: 'auto' }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {Content}
                </DialogContent>
                
            </Box>
        </Modal>
    )
}