import React, { Component } from 'react';
import { withStyles, Card, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import Add from '@material-ui/icons/AddCircle';

const icon = {
    transition: '.2s ease-in-out'
};

const styles = () => ({
    tile: {
        height: 150,
        width: 130,
        padding: 10,
    },
    media: {
        objectFit: 'cover'
    },
    name: {
        'font-size': '0.8em'
    },
    icon: {
        visibility: 'hidden'
    },
    spin: {
        ...icon,
        transform: 'rotate(45deg)',
    },
    content: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        padding: 10,
    },
    card: {
        margin: 10
    }
});

class CardTile extends Component {
    render() {
        const { classes, id, icon, name } = this.props;
        const addIconClass = this.props.active ? classes.spin : classes.icon;

        return (
            <Card key={id} className={classes.card}>
                <CardActionArea disableTouchRipple={true} className={classes.tile} onClick={this.props.pressed}>
                    <CardMedia
                        component="img"
                        alt={name}
                        className={classes.media}
                        height="94"
                        image={icon}
                        title={name}
                    />
                    <CardContent className={classes.content}>
                        <Typography className={classes.name} component='p'>{name}</Typography>
                        <Add className={addIconClass} />
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

export default withStyles(styles)(CardTile);
