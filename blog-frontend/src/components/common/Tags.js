import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TagsBlock = styled.div`
    margin-top: 0.5rem;
.tag{
    display: inline-block;
    color: #a854bd;
    text-decoration: none;
    margin-right: 0.5rem;

    &:hover{
        color: #dc9dec;
    }
}
`;

const Tags = ({ tags }) => {
    return (
        <TagsBlock>
            {tags.map(tag => (
                <Link className="tag" to={`/?tags=${tag}`} key={tag}>
                    #{tag}
                </Link>
            ))}
        </TagsBlock>
    );
};

export default Tags;