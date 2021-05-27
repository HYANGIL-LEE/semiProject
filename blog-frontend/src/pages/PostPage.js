import React from 'react';
import PostViewerContainer from '../containers/post/PostViewerContainer';
import HeaderContainer from '../containers/common/HeaderContainer';
import Footer from '../components/common/Footer';


const PostPage = () => {
    return (
        <>
            <HeaderContainer />
            <PostViewerContainer />
            <Footer />
        </>
    )
};

export default PostPage;