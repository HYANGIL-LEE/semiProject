import React from 'react';
import styled from 'styled-components';


const FooterBlock = styled.div`
    width: 100%;
    padding-top: 5rem;
`;

const Wrapper = styled.div`
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .account{
        letter-spacing: 4px;
        color:rgba(0,0,0,0.25);
        text-shadow: rgba(0,0,0,0.08);
        
    }
`;

const Footer = () => {
    return (
        <>
            <FooterBlock>
                <Wrapper>
                    <div className="account">@x.xxivequalsme</div>
                </Wrapper>
            </FooterBlock>
        </>
    );
};

export default Footer;