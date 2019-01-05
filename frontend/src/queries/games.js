import gql from 'graphql-tag';

export const gameQuery = gql`{
    games {
        website
        minage
        name
        minplayers
        description
        id
        maxplayers
        icon
        modes {
            name
            players
        }
    }
}`;
