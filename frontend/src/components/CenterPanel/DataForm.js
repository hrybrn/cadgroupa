import React, { Component } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';

class DataForm extends Component {
    state = {
        open: true,
        rank: '',
        lat: null,
        lon: null
    }

    render() {
        return <Dialog
            open={this.state.open}
            onClose={this.handleClose.bind(this)}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Give us more info to get your match made.</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your numerical rank.
                </DialogContentText>
                <TextField
                    label="Rank"
                    value={this.state.rank}
                    onChange={this.handleChange.bind(this, 'rank')}
                    id="formatted-numberformat-input"
                    InputProps={{
                        inputComponent: NumberFormat,
                    }}
                />
                <DialogContentText>
                    Accept location preferences to give you a better match.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.startSearch.bind(this)} color="primary">
                    search without location
                </Button>
                <Button onClick={this.askForLocation.bind(this)} color="primary">
                    search with location
                </Button>
            </DialogActions>
        </Dialog>;
    }

    handleChange(name, event) {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleClose() {
        this.setState({ open: false });
        this.props.onClose();
    }

    askForLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
        } else {
            this.startSearch();
        }
    }
      
    showPosition(position) {
        this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, this.startSearch.bind(this, true));
    }

    startSearch() {
        if (this.state.rank === '') {
            window.alert('You need to provide a rank to use matchma.kr.');
            return;
        }

        let searchInfo = {
            rank: parseInt(this.state.rank)
        };

        if (this.state.lat !== null && this.state.lon !== null) {
            searchInfo.lat = this.state.lat;
            searchInfo.lon = this.state.lon;
        } else {
            searchInfo.lat = 27.0;
            searchInfo.lon = 109.0;
        }

        this.setState({ open: false }, this.props.success.bind(this, searchInfo));
    }
}

export default DataForm;
