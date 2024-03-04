import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../components/GoogleLogin';
import Nav from '../components/Nav';
import { postLoginToken } from '../api/postLoginToken';

export default function Login({ isLogin, setIsLogin }) {
    const navigate = useNavigate();

    const onGoogleSignIn = async res => {
        const { credential } = res;
        const result = await postLoginToken(credential, setIsLogin);
        setIsLogin(result);
    };

    useEffect(() => {
        if (!isLogin) return;
        //navigate('/mypage');
        navigate('/');
    }, [isLogin]);

    return (
        <div>
            <h1>Login Page</h1>
            <Nav />
            <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" />
        </div>
    );
}
