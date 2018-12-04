import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const Modal = ({ handleClose, open, title, fields, buttons }) => (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
            {fields}
        </DialogContent>
        <DialogActions>
            {buttons}
        </DialogActions>
    </Dialog>
);

export default Modal;
