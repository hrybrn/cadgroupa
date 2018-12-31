import gql from 'graphql-tag';
// Putting repeatable queries here to save line count.
export const get_user_obj = gql`
    query Getuser($token: String!) {
        discord {
            getuser(token: $token)
        }
    }
`;