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
    icon,
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
    state = {
        active: false
    };

    render() {
        const { classes, id, icon, name } = this.props;
        const addIconClass = this.state.active ? classes.spin : classes.icon;
        return (
            <Card key={id} className={classes.card}>
                <CardActionArea className={classes.tile} onClick={this.toggleActivated.bind(this)}>
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

    toggleActivated() {
        this.setState(prev => {
            prev.active ? this.props.deactivated() : this.props.activated();
            return { active: !prev.active };
        });
    }
}

export default withStyles(styles)(CardTile);
